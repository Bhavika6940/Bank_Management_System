import axios from "axios";

//http request
export const http = (accessToken = null) => {
    axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
    if (accessToken) {
        axios.defaults.headers.common('Authorization') = `Bearer ${accessToken}`;
    }
    return axios;
}
export const trimData = (obj) => {
    let finalObj = {};
    for (let key in obj) {
        finalObj[key] = obj[key]?.trim();
    }
    return finalObj;
}