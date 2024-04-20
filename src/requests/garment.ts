import { apiEndpoint } from "../../config";
import { GarmentCard, garmentStore } from "../stores/GarmentStore";
import { ajax } from "./common";


export const deleteGarment = (garment: GarmentCard) => {
    return ajax.apiDelete(`/clothes/${garment.uuid}`, {
        credentials: true
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