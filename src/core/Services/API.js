// // services/api.ts
// import { //toast } from "react-//toastify";
// import "react-//toastify/dist/React//Toastify.css";
import { getAPIENDPoint, getBearerToken, getStorage, setStorage } from "./GLobalState";
// import { environment } from "../../environments";

const message = `Sorry, the request was unsuccessful. Please come back later.`;

export function prepareheaders(token = false) {
  return {

    Authorization: 'Bearer ' + (token ? token : getBearerToken()),
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin":"*"
  };
}
export function getURL() {
  // console.log(process.env)
  return getAPIENDPoint() ?? process.env.REACT_APP_API_END_POINT ?? "http://localhost:3001/api";
}

function validateAndReturnResponse(response, redux) {
  if (!response.ok) {
    // //toast.error(message);
    return { success: false, message: "Something went wrong" };
  }
  return response.json().then((e) => {
    if (
      e.code === 'token_expired' ||
      e.code === 'invalid_token' ||
      e.code === 'future_token' ||
      e.code === 'token_decode_error'
    ) {
      redux.set("login", false);
      setStorage("error_message", e.message);
    }
    return e;
  }).catch((err) => {
    //toast.error(message);
    return { success: false, message: "Something went wrong" };
  });
}


export const fetchData = (redux) => async (url, params = {}, fullURl = false, token = false, header = false) => {
  try {
    // console.log('first')
    let headers = { ...prepareheaders(token), ...(header ? { ...header } : {}) };
    delete headers['Content-Type'];
    let endpoint = fullURl ? url : getURL() + "/" + url;
    // console.log(endpoint)
    if (Object.keys(params).length) {
      let paramsString = '';
      if (url.search('\\?') >= 0) paramsString += '&';
      else paramsString += '?';
      Object.keys(params).forEach((e, idx) => {
        const end = idx < Object.keys(params).length - 1 ? '&' : '';
        paramsString += e + "=" + encodeURIComponent(params[e]) + end;
      })
      endpoint = endpoint + paramsString;
    }
    const response = await fetch(endpoint, {
      headers: headers
    });

    return validateAndReturnResponse(response, redux);

  } catch (error) {
    //toast.error(message);
    return { success: false, message: "Something went wrong" };
  }
};

export const postData = (redux) => async (url, data = {}, fullURl = false, token = false, header = false, anonymous = false) => {
  try {
    let headers = { ...prepareheaders(token), ...(header ? { ...header } : {}) };
    if (anonymous) {
      delete headers['Bearer'];
    }
    let endpoint = fullURl ? url : getURL() + "/" + url;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    return validateAndReturnResponse(response, redux);
  } catch (error) {
    //toast.error(message);
    return { success: false, message: "Something went wrong" };
  }
};

export const putData = (redux) => async (url, data = {}, fullURl = false, token = false) => {
  try {

    let headers = prepareheaders(token);
    let endpoint = fullURl ? url : getURL() + "/" + url;
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    });

    return validateAndReturnResponse(response, redux);

  } catch (error) {
    //toast.error(message);
    return { success: false, message: "Something went wrong" };
  }
};

export const deleteData = (redux) => async (url, data = {}, fullURl = false, token = false) => {
  try {

    let headers = prepareheaders(token);
    let endpoint = fullURl ? url : getURL() + "/" + url;

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify(data),
    });

    return validateAndReturnResponse(response, redux);

  } catch (error) {
    //toast.error(message);
    return { success: false, message: "Something went wrong" };
  }
};
