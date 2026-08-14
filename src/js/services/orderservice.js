import api from './api';

export const orderService = {
  postOrder: async (orderData) => {
    const response = await api.post("/v1/order", orderData);
    return response;
  },
  getOrders: async () => {
    const response = await api.get("/v1/order");
    return response.data;
  },
  getOrder: async (foodId) => {
    const response = await api.get(`/v1/order/${foodId}`);
    return response.data;
  },
  patchOrder: async (id, patchRequest) => {
    const response = await api.patch(`/v1/order/${id}`, patchRequest);
    return response;
  }
}