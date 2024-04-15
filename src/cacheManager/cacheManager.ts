import RNFS from 'react-native-fs';
import { GarmentCard, garmentStore } from '../stores/GarmentStore';
import { staticEndpoint } from '../../config';
import { arrayComp, getOutfitImageName } from './utils';
import { getImageSource, joinPath } from '../utils';
import { Outfit, outfitStore } from '../stores/OutfitStore';

// saves:
// - images
// - garmentCards
// - outfits

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

    async downloadImage(remoteURI: string, path: string) {
        try {
            const downloadRes = await RNFS.downloadFile({
                fromUrl: remoteURI,
                toFile: path
            }).promise;
            return downloadRes.statusCode;
        }
        catch (err) {
            console.error(err);
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

    async changeImageToLocal(garments: GarmentCard[]) {
        return garments.map(async garment => {
            if (garment.image.type === 'remote') {
                const image_name = `${garment.uuid}.png`;
                const image_path = joinPath(this.clothesDirPath, image_name);
                const alreadyExists = await RNFS.exists(image_path);
                if (!alreadyExists) {
                    const status = await this.downloadImage(getImageSource(garment.image).uri, image_path);
                    if (status !== 200) {
                        console.error(status);
                        return false;
                    }
                }

                garment.setImage({
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

        garmentStore.setGarments(remoteGarments);

        this.changeImageToLocal(garmentStore.garments);

        const adds = compRes.toAddIndices.map(async id => {
            const garment = filteredRemoteGarments[id] as GarmentCard;
            const imageName = `${garment.uuid}.png`;
            const imagePath = joinPath(this.clothesDirPath, imageName);
            const status = await this.downloadImage(getImageSource(garment.image).uri, imagePath);
            if (status === 200) {
                garmentStore.getGarmentByUUID(garment.uuid!)?.setImage({
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

        Promise.all([...adds, ...dels]).then(() => {
            this.writeGarmentCards();
        })
    }

    async updateOutfits(localOutfits: Outfit[], remoteOutfits: Outfit[]) {        
        console.log('local', localOutfits)
        console.log('remote', remoteOutfits)

        
        const compRes = arrayComp(localOutfits, remoteOutfits, compByUUID);
        
        console.log(compRes)
        console.log(compRes.diffs)

        outfitStore.setOutfits(remoteOutfits);

        // console.log('outfits', remoteOutfits);

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
                        outfitStore.getOutfitByUUID(local.uuid!)?.setImage({
                            type: 'local',
                            uri: newPath
                        })
                    }
                }

            }
        })

        Promise.all([...adds, ...dels, ...imageUpdates]).then(() => {
            this.writeOutfits();
        })
    }
}

export const cacheManager = new CacheManager(RNFS.DocumentDirectoryPath);
