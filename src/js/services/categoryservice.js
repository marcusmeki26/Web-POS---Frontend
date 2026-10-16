import api from './api';
const categoryApi = import.meta.env.VITE_CATEGORY_API;

export const categoryService = {
  getCategoriesCount: async () => {
    const response = await api.get(`${categoryApi}/count`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get(`${categoryApi}`);
    return response;
  },
  postCategory: async (postRequest) => {
    const response = await api.post(`${categoryApi}`, postRequest);
    return response;
  },
  patchCategory: async (patchRequest, oldCode) => {
    const response = await api.patch(`${categoryApi}/${oldCode}`, patchRequest);
    return response;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`${categoryApi}/${id}`);
    return response;
  }
}