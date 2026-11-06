import api from "./api";
const userApi = import.meta.env.VITE_USER_API

export const userService = {
  getUsers: async () => {
    return await api.get(userApi);
  },
  getUserRoles: async () => {
    return await api.get(`${userApi}/roles`);
  },
  putUser: async (id, putRequest) => {
    return await api.put(`${userApi}/${id}`, putRequest);
  },
  putChangePassword: async (id, putRequest) => {
    return await api.put(`${userApi}/change-password/${id}`, putRequest);
  },
  postUser: async (postRequest) => {
    return await api.post(userApi, postRequest);
  },
  deleteUser: async (id) => {
    return await api.delete(`${userApi}/${id}`);
  }
};