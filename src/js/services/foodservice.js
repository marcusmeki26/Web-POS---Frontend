import api from './api';

export const foodService = {
  getMenuList: async () => {
    const response = await api.get("/v1/food");
    return response.data;
  },
  getMenuListByCategory: async (categoryType) => { // Returns -> A list of food by category
    const response = await api.get(`/v1/food?category=${categoryType}`);
    return response.data;
  },
  patchFoodById: async (foodId, patchRequest) => {
    const response = await api.patch(`/v1/food/${foodId}`, patchRequest);
    return response;
  },
  deleteVariant: async (foodId, sizeId) => {
    const response = await api.delete(`/v1/food/${foodId}/${sizeId}`);
    return response;
  }
}