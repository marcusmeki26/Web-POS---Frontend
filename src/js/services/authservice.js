import api from './api';
const loginApi = import.meta.env.VITE_LOGIN_API;
const refreshApi = import.meta.env.VITE_REFRESH_API;
let accessToken = null;

export const authService = {
  login: async (creds) => { // Returns -> 
    const response = await api.post(loginApi, creds);
    setAccessToken(response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken);
    return response;
  },
  refresh: async() => {
    const refreshToken = localStorage.getItem("refresh_token");
    const token = {
      refreshToken: refreshToken
    }
    const response = await api.post(refreshApi, token);
    setAccessToken(response.data.accessToken)
    return response;
  }
}

export function setAccessToken(pAccessToken){
  accessToken = pAccessToken;
}

export function getAccessToken(){
  return accessToken;
}

export function getRole(){
  const base64Url  = accessToken.split('.')[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  const role = JSON.parse(jsonPayload).role;
  return role;
}