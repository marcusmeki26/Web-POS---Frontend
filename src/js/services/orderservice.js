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
  getOrderByFoodId: async (foodId) => {
    const response = await api.get(`/v1/order/${foodId}`);
    return response.data;
  },
  getOrderSumUnplaced: async () => {
    const response = await api.get("/v1/order/sum");
    return response.data;
  },
  getOrderByTableId: async (tableId) => {
    const response = await api.get(`/v1/order?table=${tableId}`);
    return response.data;
  },
  getCurrentReceiptNo: async () => {
    const response = await api.get(`/v1/order/current/receipt`);
    return response.data;
  },
  getUnplacedOrders: async () => {
    const resposne = await api.get(`/v1/order/unplaced`);
    return resposne.data;
  },
  patchOrder: async (id, patchRequest) => {
    const response = await api.patch(`/v1/order/${id}`, patchRequest);
    return response;
  },
  patchOrderByReceiptNo: async (receiptNo, patchRequest) => {
    const response = await api.patch(`/v1/order/receipt/${receiptNo}`, patchRequest);
    return response;
  },
  patchRetrieveOrderByReceiptNo: async (receiptNo, patchRequest) => {
    const response = await api.patch(`/v1/order/retrieve/${receiptNo}`, patchRequest);
    return response;
  },
  deleteOrder: async (deleteRequest) => {
    const response = await api.delete(`/v1/order`, { data: deleteRequest});
    return response;
  }
}