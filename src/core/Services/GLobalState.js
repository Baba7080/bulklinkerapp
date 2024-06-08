const storage = sessionStorage;
export const getStorage = (key) => { return storage.getItem(key) };
export const setStorage = (key, value) => { storage.setItem(key, (value)) };
export const getBearerToken = () => { return storage.getItem("auth_token")?.length ? storage.getItem("auth_token") : process.env.BEARER ?? process.env.REACT_APP_BEARER ?? "" };
export const getAPIENDPoint = () => { return storage.getItem("API_END_POINT") };
export const removeItem = (key) => { storage.removeItem(key) };