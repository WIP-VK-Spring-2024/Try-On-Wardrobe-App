import { userPhotoStore } from "../stores/UserPhotoStore"
import { processNetworkError } from "../stores/AppState"
import { ajax } from "./common"

export const deleteUserPhoto = (uuid: string) => {
  ajax.apiDelete(`/photos/${uuid}`, {credentials: true})
    .then(_ => userPhotoStore.removePhoto(uuid))
    .catch(error => processNetworkError(error));
};
