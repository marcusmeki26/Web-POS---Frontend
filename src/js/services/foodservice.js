import api from './api';
const foodApi = import.meta.env.VITE_FOOD_API;

export const foodService = {
  postFood: async (postRequest) => {
    const response = await api.post(`${foodApi}`, postRequest);
    return response;
  },
  getMenuList: async () => {
    const response = await api.get(`${foodApi}`);
    return response.data;
  },
  getMenuListByCategory: async (categoryType) => { // Returns -> A list of food by category
    const response = await api.get(`${foodApi}?category=${categoryType}`);
    return response.data;
  },
  patchFoodById: async (foodId, patchRequest) => {
    const response = await api.patch(`${foodApi}/${foodId}`, patchRequest);
    return response;
  },
  deleteFood: async (foodId) => {
    const response = await api.delete(`${foodApi}/${foodId}`);
    return response;
  },
  deleteVariant: async (foodId, sizeId) => {
    const response = await api.delete(`${foodApi}/${foodId}/${sizeId}`);
    return response;
  }
}