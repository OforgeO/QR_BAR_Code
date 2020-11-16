import * as SecureStore from 'expo-secure-store';
let base_url = 'http://104.156.230.143:2083/api/';
//let base_url = 'http://192.168.8.55:2083/api/';
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};
function createCall(path, data = null, headers = {}, method = 'POST') {
    const merged = {
        ..._headers,
        ...headers,
    };

    let body = {};
    if (data) {
        body = data;
    }
    /*if (token) {
        body.api_token = token;
    }*/
    let strData = JSON.stringify(body);
    if(method == 'POST')
        return fetch(
            `${base_url}${path}`, {
                method : method,
                headers: merged,
                body: strData,
            },
        ).then((resp) => resp.json());
    else if(method == 'GET')
        return fetch(
            `${base_url}${path}`, {
                method : method,
                headers: merged,
            },
        ).then((resp) => resp.json());
}
export function signIn(username, password){
    return createCall(
        'company/auth/login/Signin',
        {username, password}
    );
}