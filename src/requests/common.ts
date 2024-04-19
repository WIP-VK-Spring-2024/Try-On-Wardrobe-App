import { apiEndpoint } from "../../config";
import { appState } from "../stores/AppState";
import { joinPath } from "../utils";

interface AjaxProps {
    apiEndpoint: string
}

interface AjaxCommonParams {
    credentials?: boolean
}

interface AjaxPostParams extends AjaxCommonParams {
    body?: any
}

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type HeadersType = {[key: string]: string};

class Ajax {
    apiEndpoint: string
    constructor(props: AjaxProps) {
        this.apiEndpoint = props.apiEndpoint;
    }

    addCredentials(headers: HeadersType, credentials?: boolean) {
        if (credentials) {
            if (appState.JWTToken === undefined) {
                console.error('No JWT Token');
            } else {
                headers['X-Session-Id'] = appState.JWTToken;
            }
        }
        return headers;
    }

    fetch(uri: string, method: FetchMethod, params?: AjaxPostParams) {
        const headers: HeadersType = this.addCredentials({}, params?.credentials);

        return fetch(uri, {
            method: method,
            headers: headers,
            body: params?.body
        });
    }

    get(uri: string, params?: AjaxCommonParams) {
        return this.fetch(uri, 'GET', params);
    }

    post(uri: string, params?: AjaxPostParams) {
        return this.fetch(uri, 'POST', params); 
    }

    delete(uri: string, params?: AjaxCommonParams) {
        return this.fetch(uri, 'DELETE', params);
    }

    put(uri: string, params?: AjaxPostParams) {
        return this.fetch(uri, 'PUT', params);
    }

    patch(uri: string, params?: AjaxPostParams) {
        return this.fetch(uri, 'PATCH', params);
    }

    apiGet(uri: string, params?: AjaxCommonParams) {
        return this.get(joinPath(this.apiEndpoint, uri), params);
    }

    apiPost(uri: string, params?: AjaxPostParams) {
        return this.post(joinPath(this.apiEndpoint, uri), params);
    }

    apiDelete(uri: string, params?: AjaxCommonParams) {
        return this.delete(joinPath(this.apiEndpoint, uri), params);
    }

    apiPut(uri: string, params?: AjaxPostParams) {
        return this.put(joinPath(this.apiEndpoint, uri), params);
    }

    apiPatch(uri: string, params?: AjaxPostParams) {
        return this.patch(joinPath(this.apiEndpoint, uri), params);
    }
}

export const ajax = new Ajax({apiEndpoint: apiEndpoint});
