import { profileStore, Subscription } from "../stores/ProfileStore"
import { processNetworkError } from "../stores/AppState"
import { ajax } from "./common"
import { Gender, Privacy } from "../stores/common"

export const updateUserSettings = (gender: Gender, privacy: Privacy) => {
    const formData = new FormData();
    formData.append('gender', gender);
    formData.append('privacy', privacy);

    ajax.apiPut(`/users/${profileStore.currentUser?.uuid}`, {
        credentials: true,
        body: formData,
    })
    .then(_ => {
        profileStore.currentUser?.setGender(gender);
        profileStore.currentUser?.setPrivacy(privacy);
    })
    .catch(error => processNetworkError(error))
}

export const searchUsers = (query: string, since: string, limit?: number) => {
    const urlParams = new URLSearchParams({
        name: query,
        since: since,
        limit: limit?.toString() || '16'
    })

    ajax.apiGet('/users?'+urlParams.toString(), {credentials: true})
        .then(resp => resp.json())
        .then(json => {
            const users: Subscription[] = json;
            profileStore.appendUsers(users);
            profileStore.setLastUserName(users.length > 0 ? users[users.length - 1].name : '')
        })
        .catch(error => processNetworkError(error))
}

export const getSubs = () => {
    ajax.apiGet('/users/subbed', {credentials: true})
        .then(resp => resp.json())
        .then(json => {
            const subs: Subscription[] = json;
            subs.forEach(sub => sub.isSubbed = true);
            profileStore.currentUser?.setSubs(subs);
        })
        .catch(error => processNetworkError(error))
}

export const userSub = (uuid: string) => {
    return ajax.apiPost(`/users/${uuid}/sub`, {credentials: true})
                .catch(error => processNetworkError(error));
};

export const userUnsub = (uuid: string) => {
    return ajax.apiDelete(`/users/${uuid}/sub`, {credentials: true})
                .catch(error => processNetworkError(error));
};
