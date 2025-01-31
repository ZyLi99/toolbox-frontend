import {showErrorPage} from "../../index";
import {Session} from "../Session/Session";


export interface CallInterface<D> {
    callData: D
    success: boolean
    status: number
    response: Response
}

export interface APIArgs {
    errorCallback?: APIErrorCallback
    keepalive?: boolean
}

export const DefaultAPIArgs = {
    errorCallback: undefined,
    keepalive: false
}

/**
 * Alle API Übermittlungsmethoden
 */
declare type Methods = "GET" | "POST" | "DELETE" | "PUT";

export type APIErrorCallback = ((reason: Error) => void);

/**
 * Führt eine HTTP-Request auf der genannten URL aus.
 * Hierzu kann auch ein Token übergeben werden, der zur Authentifizierung im Header platziert wird.
 *
 * @param URL URL zur Backend-Route/ ohne slash am Anfang
 * @param method API Übermittlungsmethode
 * @param data Inhalt des Requests
 * @param token
 * @param apiArgs
 */
const callAPI = async <D extends object>(
    URL: string,
    method: Methods,
    data?: FormData | Blob | URLSearchParams,
    token?: boolean,
    apiArgs?: APIArgs
): Promise<CallInterface<D> | null> => {
    let callURL = process.env.REACT_APP_API + URL;

    // METHOD
    if (data?.constructor.name === "FormData" && method === "PUT") {
        (data as FormData).append("_method", "PUT");
        method = "POST";
    }
    if (data?.constructor.name === "URLSearchParams") {
        callURL = callURL.concat("?" + (data as URLSearchParams).toString());
        data = undefined;
    }

    // HEADER
    let headers: HeadersInit = new Headers();
    headers.append("Accept", "application/json");

    // TODO: CAN BE REMOVED LATER
    headers.append("Bypass-Tunnel-Reminder", "bypass");

    // TOKEN
    if (token !== undefined && token) {
        let apiToken = Session.getToken() as string;
        headers.append("Authorization", "Bearer " + apiToken);
    }

    // REQUEST-INIT
    let requestInit: RequestInit = {
        method: method,
        headers: headers,
        body: data,
        mode: "cors",
        keepalive: apiArgs?.keepalive
    }

    try {
        // CALL THE API
        let call = await fetch(callURL, requestInit);
        let callData = null;
        try {
            callData = await call.json();
        } catch (ex) {
        }

        // BUILD RESPONSE
        return {
            callData: callData,
            success: (call.status >= 200 && call.status < 300),
            status: call.status,
            response: call
        };
    } catch (e) {
        if (apiArgs?.errorCallback !== undefined) {
            apiArgs.errorCallback(e as Error);
        } else {
            showErrorPage(500);
        }
        return null;
    }
}

export {
    callAPI
};
