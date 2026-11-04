import api from './api';
import { PAGINATION_CONFIG } from '../configuration/pagination';

const foodApi = import.meta.env.VITE_FOOD_API;

export const foodService = {
  getMenuList: async (page, size, sortBy) => {
    if(page == null || size == null || sortBy == null)
      return await api.get(`${foodApi}`, {
        params: {
          size: PAGINATION_CONFIG.DEFUALT_PAGE_SIZE,
          sort: "id"
        }
      });
    else 
      return await api.get(`${foodApi}?page=${page}&size=${size}&sort=${sortBy}`);
  },
  getMenuListByCategory: async (categoryType, page, size, sortBy) => { // Returns -> A list of food by category
    if(page === null)
      return await api.get(`${foodApi}?category=${categoryType}&size=${size}&sort=${sortBy}`);
    else
      return await api.get(`${foodApi}?category=${categoryType}&page=${page}&size=${size}&sort=${sortBy}`);
  },
  getImage: async (foodId) => { // Returns -> The image based on its food id
    const response = await api.get(`${foodApi}/image/${foodId}`, { responseType: 'blob' });
    return response;
  },
  postFood: async (postRequest) => {
    const response = await api.post(`${foodApi}`, postRequest);
    return response;
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