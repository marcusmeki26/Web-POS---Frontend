import api from './api';
const sizeApi = import.meta.env.VITE_SIZE_API;

export const sizeService = {
  getSizes: async () => {
    const response = await api.get(sizeApi);
    return response;
  },
  postSize: async (postRequest) => {
    const response = await api.post(sizeApi, postRequest);
    return response;
  },
  patchSize: async (patchRequest, id) => {
    const response = await api.patch(`${sizeApi}/${id}`, patchRequest);
    return response;
  },
  deleteSize: async(id) => {
    const response = await api.delete(`${sizeApi}/${id}`);
    return response;
  }
}