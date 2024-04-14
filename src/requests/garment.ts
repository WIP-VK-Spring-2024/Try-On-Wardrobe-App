import { apiEndpoint } from "../../config";
import { GarmentCard, garmentStore } from "../stores/GarmentStore";


export const deleteGarment = (garment: GarmentCard) => {
    return fetch(apiEndpoint + `clothes/${garment.uuid}`, {
        method: 'DELETE'
    }).then((response) => {
        if (garment.uuid) {
            garmentStore.removeGarment(garment.uuid);
        }
        return true;
    }).catch((err) => {
        console.error(err)
        return false;
    })
}