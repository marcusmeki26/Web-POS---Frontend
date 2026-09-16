import api from './api';

export const tableListService = {
  getTables: async () => { // Returns -> List of tables
    const response = await api.get("/v1/table");
    return response.data;
  },
};