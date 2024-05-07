import { apiEndpoint } from "../../config";
import { GarmentCard, garmentStore } from "../stores/GarmentStore";
import { clearObj } from "../utils";
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

export const updateGarment = (garment: GarmentCard) => {
    const garmentUpdate = (garment: GarmentCard) => ({
        uuid: garment.uuid,
        name: garment.name,
        type_id: garment.type?.uuid,
        subtype_id: garment.subtype?.uuid,
        style_id: garment.style?.uuid,
        tags: garment.tags,
        seasons: garment.seasons
      });
  
    const new_garment = garmentUpdate(garment);

    clearObj(new_garment);

    return ajax.apiPut('/clothes/' + garment.uuid, {
        credentials: true,
         body: JSON.stringify(new_garment)
       })
       .then(resp => resp.json())
}
