import { apiEndpoint } from "../../config"
import { userPhotoStore } from "../stores/UserPhotoStore"
import { joinPath } from "../utils"
import { processNetworkError } from "../stores/AppState"

export const deleteUserPhoto = (uuid: string) => {
  fetch(joinPath(apiEndpoint, `/photos/${uuid}`), {method: "DELETE"})
    .then(_ => userPhotoStore.removePhoto(uuid))
    .catch(error => processNetworkError(error));
};
