import api from './api';

export const orderTypeService = {
  getOrderTypes: async () => {
    const response = await api.get("/v1/order-type");
    return response.data;
  }
};