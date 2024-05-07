import RNFS from 'react-native-fs';
import { GarmentCard, GarmentStore, garmentStore } from '../stores/GarmentStore';
import { arrayComp, getOutfitImageName } from './utils';
import { LoginSuccessResponse, getImageSource, imageExists, joinPath, notEmpty } from '../utils';
import { Outfit, OutfitStore, outfitStore } from '../stores/OutfitStore';
import { appState } from '../stores/AppState';
import { ajax } from '../requests/common';
import { profileStore } from '../stores/ProfileStore';
import { convertLoginResponse } from "../utils"
import { ImageType } from '../models';

// saves:
// - images
// - garmentCards
// - outfits
// - JWTToken

type withUUID = {uuid: string | undefined};
const compByUUID = (a: withUUID, b: withUUID) => a.uuid === b.uuid;

export class CacheManager {
    rootDirPath: string
    dataDirPath: string
    clothesDirPath: string
    outfitsDirPath: string

    constructor(rootDirPath: string) {
        this.rootDirPath = rootDirPath;

        this.dataDirPath = joinPath(rootDirPath, '/data');

        this.clothesDirPath = joinPath(rootDirPath, '/images/clothes');
        this.outfitsDirPath = joinPath(rootDirPath, '/images/outfits');

        RNFS.mkdir(rootDirPath);
        RNFS.mkdir(this.dataDirPath);
        RNFS.mkdir(this.clothesDirPath);
        RNFS.mkdir(this.outfitsDirPath);
    }

    joinRootDirPath(...pathes: string[]) {
        return joinPath(this.rootDirPath, ...pathes);
    }

    joinDataDirPath(...pathes: string[]) {
        return joinPath(this.dataDirPath, ...pathes);
    }

    async readJSON(path: string) {
        const exists = await RNFS.exists(path)
        if (!exists)
            return undefined;

        const data = await RNFS.readFile(path);

        return JSON.parse(data);
    }

    async readGarmentCards(): Promise<GarmentCard[]> {
        const path = this.joinDataDirPath('/garments.json');
        const data = await this.readJSON(path);

        return data || [];
    }

    async writeGarmentCards(cards?: GarmentCard[]) {
        const data = JSON.stringify(cards || garmentStore.garments);

        const path = this.joinDataDirPath('/garments.json');
        RNFS.writeFile(path, data);
    }

    async readOutfits(): Promise<Outfit[]> {
        const path = this.joinDataDirPath('/outfits.json');
        const data = await this.readJSON(path);

        return data || [];
    }

    async writeOutfits() {
        const data = JSON.stringify(outfitStore.outfits);

        const path = this.joinDataDirPath('/outfits.json');
        RNFS.writeFile(path, data);
    }

    async readToken() {
        const path = this.joinDataDirPath('/token.tkn');

        try {
            const data = await RNFS.readFile(path);
    
            return data;
        } catch (e) {
            return false;
        }

    }

    async deleteToken() {
        const path = this.joinDataDirPath('/token.tkn');
        return RNFS.unlink(path);
    }

    async writeToken() {
        if (appState.JWTToken === undefined) {
            console.error('unable to save undefined token');
            return false;
        }

        const path = this.joinDataDirPath('/token.tkn');
        RNFS.writeFile(path, appState.JWTToken);
        return true;
    }

    async updateToken(oldToken: string) {
        return ajax.apiPost('/renew', {
            headers: {
                'X-Session-Id': oldToken
            }
        }).then(resp => {
            return resp.json().then(json => {
                console.log(json);

                appState.login(
                    json.token,
                    json.user_id
                );
                profileStore.setUser(convertLoginResponse(json))

                return this.writeToken();
            });
        }).catch(reason => {
            console.error(reason);
            return false;
        })
    }

    async readViewedOnboarding() {
        const path = this.joinDataDirPath('/onboarding.json');

        try {
            const _ = await RNFS.readFile(path);
            appState.setViewedOnboarding(true);
            return true;
        } catch (e) {
            appState.setViewedOnboarding(false);
            return false;
        }
    }

    async writeViewedOnboarding() {
        if (!appState.viewedOnboarding) {
            return false;
        }

        const path = this.joinDataDirPath('/onboarding.json');
        RNFS.writeFile(path, JSON.stringify({viewed: appState.viewedOnboarding}));
        return true;
    }

    async downloadImage(remoteURI: string, path: string) {
        try {
            const downloadRes = await RNFS.downloadFile({
                fromUrl: remoteURI,
                toFile: path
            }).promise;
            return downloadRes.statusCode;
        }
        catch (err) {
            console.error('downloading img', remoteURI, err);
        }
    }

    async deleteImage(path: string) {
        RNFS.unlink(path);
    }

    async updateImage(props: {oldPath: string, uri: string, newPath: string}) {
        const status = await this.downloadImage(
            props.uri, 
            props.newPath
        );
            
        if (status === 200) {
            this.deleteImage(props.oldPath);
        }

        return status;
    }

    changeImageToLocal<T extends {image: ImageType, setImage(img: ImageType):void}>
    (items: T[], getImageName: (item: T) => string) {
        return items.map(async item => {
            if (item.image.type === 'remote') {
                // const image_name = `${item.uuid}.png`;
                const image_name = getImageName(item);
                const image_path = joinPath(this.clothesDirPath, image_name);
                const alreadyExists = await RNFS.exists(image_path);

                if (!alreadyExists) {
                    const status = await this.downloadImage(getImageSource(item.image).uri, image_path);
                    console.log(status)
                    if (status !== 200) {
                        console.error(status);
                        return false;
                    }
                }

                item.setImage({
                    type: 'local',
                    uri: image_path
                })
            }
            return true;
        })
    }

    async updateGarments(localGarments: GarmentCard[], remoteGarments: GarmentCard[]) {    
        const filteredLocalGarments = localGarments.filter(el => el.uuid !== undefined) as unknown as withUUID[];
        const filteredRemoteGarments = remoteGarments.filter(el => el.uuid !== undefined) as unknown as withUUID[];

        const compRes = arrayComp(filteredLocalGarments, filteredRemoteGarments, compByUUID);

        const newGarmentStore = new GarmentStore();

        newGarmentStore.setGarments(remoteGarments);

        const changedToLocal = Promise.all(this.changeImageToLocal(newGarmentStore.garments, (item: GarmentCard) => `${item.uuid}.png`));

        const adds = compRes.toAddIndices.map(async id => {
            const garment = filteredRemoteGarments[id] as GarmentCard;
            const imageName = `${garment.uuid}.png`;
            const imagePath = joinPath(this.clothesDirPath, imageName);
            const status = await this.downloadImage(getImageSource(garment.image).uri, imagePath);
            if (status === 200) {
                newGarmentStore.getGarmentByUUID(garment.uuid!)?.setImage({
                    type: 'local',
                    uri: imagePath
                })
                return true;
            }
            return false;
        })

        const dels = compRes.toDeleteIndices.map(async id => {
            const garment = filteredLocalGarments[id] as GarmentCard;
            const imageName = `${garment.uuid}.png`;
            await this.deleteImage(joinPath(this.clothesDirPath, imageName));
            return true;
        })

        return Promise.all([changedToLocal, ...adds, ...dels]).then(() => {
            garmentStore.setGarments(newGarmentStore.garments);
            console.log('writing to disk')
            this.writeGarmentCards();
            return true;
        })
    }

    async updateOutfits(localOutfits: Outfit[], remoteOutfits: Outfit[]) {        
        const compRes = arrayComp(localOutfits, remoteOutfits, compByUUID);
        
        const newOutfitStore = new OutfitStore();

        newOutfitStore.setOutfits(remoteOutfits);

        const outfitsWithImages = newOutfitStore.outfits.filter(imageExists);

        const changedToLocal = Promise.all(this.changeImageToLocal(outfitsWithImages, getOutfitImageName));
        const adds = compRes.toAddIndices.map(async id => {
            const outfit = remoteOutfits[id];
            const imageName = getOutfitImageName(outfit);
            const imagePath = joinPath(this.outfitsDirPath, imageName);

            const status = await this.downloadImage(getImageSource(outfit.image!).uri, imagePath);

            if (status === 200) {
                outfitStore.getOutfitByUUID(outfit.uuid!)?.setImage({
                    type: 'local',
                    uri: imagePath
                })
                return true;
            }

            return false;
        })

        const dels = compRes.toDeleteIndices.map(async id => {
            const outfit = localOutfits[id];
            const imageName = getOutfitImageName(outfit);

            await this.deleteImage(joinPath(this.outfitsDirPath, imageName));
            return true;
        })

        const imageUpdates = compRes.diffs.map(async diff => {
            if (Object.hasOwn(diff, 'updated_at')) {
                const local = localOutfits[diff.id1];
                const remote = remoteOutfits[diff.id2];

                const oldPath = joinPath(this.outfitsDirPath, getOutfitImageName(local));
                const newPath = joinPath(this.outfitsDirPath, getOutfitImageName(remote));

                console.log(oldPath, newPath);

                if (remote.image !== undefined) {
                    const status = await this.updateImage({
                        oldPath: oldPath,
                        newPath: newPath,
                        uri: getImageSource(remote.image).uri
                    })

                    if (status === 200) {
                        newOutfitStore.getOutfitByUUID(local.uuid!)?.setImage({
                            type: 'local',
                            uri: newPath
                        })
                    }
                }

            }
        })

        return Promise.all([changedToLocal, ...adds, ...dels, ...imageUpdates]).then(() => {
            outfitStore.setOutfits(newOutfitStore.outfits);
            this.writeOutfits();
            return true;
        })
    }
}

export const cacheManager = new CacheManager(RNFS.DocumentDirectoryPath);
