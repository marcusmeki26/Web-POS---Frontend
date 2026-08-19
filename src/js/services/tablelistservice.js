import api from './api';

export const tableListService = {
  getTables: async () => {
    const response = await api.get("/v1/table");
    return response.data;
  }
};