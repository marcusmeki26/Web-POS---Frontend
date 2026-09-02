import api from './api';

export const orderService = {
  postOrder: async (orderData) => { // Returns -> empty
    const response = await api.post("/v1/order", orderData);
    return response;
  },
  getOrders: async () => { // Returns -> list of orders
    const response = await api.get("/v1/order");
    return response.data;
  },
  getOrderByFoodId: async (foodId) => { // Returns -> single order
    const response = await api.get(`/v1/order/${foodId}`);
    return response.data;
  },
  getOrderSumUnplaced: async () => { // Returns -> sum of unplaced order
    const response = await api.get("/v1/order/sum");
    return response.data;
  },
  getOrderByTableId: async (tableId) => { // Returns -> order based on table id
    const response = await api.get(`/v1/order?table=${tableId}`);
    return response.data;
  },
  getCurrentReceiptNo: async () => { // Returns -> current receipt no
    const response = await api.get(`/v1/order/current/receipt`);
    return response.data;
  },
  getUnplacedOrders: async () => { // Returns -> list of unplaced order
    const resposne = await api.get(`/v1/order/unplaced`);
    return resposne.data;
  },
  patchOrder: async (id, patchRequest) => { // Returns -> empty
    const response = await api.patch(`/v1/order/${id}`, patchRequest);
    return response;
  },
  patchOrderByReceiptNo: async (receiptNo, patchRequest) => { // Returns -> empty
    const response = await api.patch(`/v1/order/receipt/${receiptNo}`, patchRequest);
    return response;
  },
  patchOrdersByReceiptNo: async (receiptNo, patchRequest) => { // Returns -> empty
    const response  = await api.patch(`/v1/order/receipt/existing/${receiptNo}`, patchRequest);
    return response;
  },
  patchRetrieveOrderByReceiptNo: async (receiptNo, patchRequest) => { // Returns -> empty
    const response = await api.patch(`/v1/order/retrieve/${receiptNo}`, patchRequest);
    return response;
  },
  deleteOrder: async (deleteRequest) => { // Returns -> empty
    const response = await api.delete(`/v1/order`, { data: deleteRequest});
    return response;
  }
}