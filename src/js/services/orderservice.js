import api from './api';

export const orderService = {
  getMenuList: async () => {
    const response = await api.get("/v1/food");
    return response.data;
  }
}