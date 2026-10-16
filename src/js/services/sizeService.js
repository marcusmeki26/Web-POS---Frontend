import api from './api';
const sizeApi = import.meta.env.VITE_SIZE_API;

export const sizeService = {
  getSizes: async () => {
    const response = await api.get(sizeApi);
    return response;
  }
}