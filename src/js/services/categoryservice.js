import api from './api';

export const categoryService = {
  getCategoriesCount: async () => {
    const response = await api.get("/v1/category/count");
    return response.data;
  }
}