import { profileStore } from "../stores/ProfileStore"
import { processNetworkError } from "../stores/AppState"
import { ajax } from "./common"
import { Gender, Privacy } from "../stores/common"

export const updateUserSettings = (gender: Gender, privacy: Privacy) => {
    ajax.apiPut(`/users/${profileStore.uuid}`, {
        credentials: true,
        body: {
            gender: gender,
            privacy: privacy,
        }
    })
    .then(_ => {
        profileStore.setGender(gender);
        profileStore.setPrivacy(privacy);
    })
    .catch(error => processNetworkError(error))
}
