import RNFS from 'react-native-fs';
import { GarmentCard, garmentStore } from '../stores/GarmentStore';
import { staticEndpoint } from '../../config';
import { arrayComp } from './utils';
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

        this.dataDirPath = joinPath(rootDirPath, 'data');

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

    async readGarmentCards() {
        const path = this.joinDataDirPath('/garments.json');
        if (!RNFS.exists(path))
            return [];

        // const data = await RNFS.readFile(path);

        // return JSON.parse(data);
        return [];
    }

    async writeGarmentCards(cards?: GarmentCard[]) {
        const data = JSON.stringify(cards || garmentStore.garments);

        const path = this.joinDataDirPath('/garments.json');
        RNFS.writeFile(path, data);
    }

    async readOutfits() {
        const data = await RNFS.readFile(this.joinDataDirPath('/outfits.json'));

        return JSON.parse(data);
    }

    async writeOutfits() {
        const data = JSON.stringify(outfitStore.outfits);

        const path = this.joinDataDirPath('/garments.json');
        RNFS.writeFile(path, data);
    }

    async downloadImage(remoteURI: string, path: string) {
        // console.log('downloading to', joinPath(RNFS.DocumentDirectoryPath, path))
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

    async updateImage(garment: GarmentCard, newGarment: GarmentCard) {
        const oldImageName = `${garment.uuid}.png`;
        this.deleteImage(joinPath(this.clothesDirPath, oldImageName));

        const newImageName = `${newGarment.uuid}.png`;
        const newImagePath = joinPath(this.clothesDirPath, newImageName);
        const status = await this.downloadImage(
            getImageSource(newGarment.image).uri, 
            newImagePath
        );

        if (status === 200) {
            garment.setImage({
                type: 'local',
                uri: newImagePath
            })
        };
    }

    async updateGarments(localGarments: GarmentCard[], remoteGarments: GarmentCard[]) {
        const filteredLocalGarments = localGarments.filter(el => el.uuid !== undefined) as unknown as withUUID[];
        const filteredRemoteGarments = remoteGarments.filter(el => el.uuid !== undefined) as unknown as withUUID[];

        const compRes = arrayComp(filteredLocalGarments, filteredRemoteGarments, compByUUID);

        garmentStore.setGarments(remoteGarments);

        const adds = compRes.toAddIndices.map(async id => {
            const garment = filteredRemoteGarments[id] as GarmentCard;
            const imageName = `${garment.uuid}.png`;
            // const imagePath = joinPath('/clothes', imageName);
            const imagePath = joinPath(this.clothesDirPath, imageName);
            console.log(getImageSource(garment.image).uri)
            const status = await this.downloadImage(getImageSource(garment.image).uri, imagePath);
            console.log('GARMENT DOWNLOAD STATUS', status);
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
        const compRes = arrayComp(localOutfits, remoteOutfits, compByUUID);

        console.log(compRes);
        console.log(compRes.diffs);

        outfitStore.setOutfits(remoteOutfits);

        const adds = compRes.toAddIndices.map(async id => {
            const outfit = remoteOutfits[id];
            const imageName = `${outfit.uuid}.png`;
            const imagePath = joinPath('/outfits', imageName);

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
            const imageName = `${outfit.uuid}.png`;

            await this.deleteImage(joinPath('/outfits', imageName));
            return true;
        })

        Promise.all([...adds, ...dels]).then(() => {
            outfitStore.setOutfits(remoteOutfits);
        })
    }
}

export const cacheManager = new CacheManager(RNFS.DocumentDirectoryPath);
