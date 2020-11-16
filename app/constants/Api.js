let base_url = 'https://deal.kouguone.com/api/';
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
export function login(email, password){
    return createCall(
        'login',
        {email, password}
    );
}
export function register(username, email, password){
    return createCall(
        'register',
        {username, email, password}
    );
}