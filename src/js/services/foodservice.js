import api from './api';

export const foodService = {
  getMenuList: async () => {
    const response = await api.get("/v1/food");
    return response.data;
  },
  getMenuListByCategory: async (categoryType) => {
    const response = await api.get(`/v1/food?category=${categoryType}`);
    return response.data;
  }
}