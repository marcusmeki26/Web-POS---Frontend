import api from './api';

export const taxService = {
  getActiveTax: async () => {
    const response = await api.get("/v1/tax/true");
    return response.data;
  }
}