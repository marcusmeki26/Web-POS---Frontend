import api from './api';
const orderApi = import.meta.env.VITE_ORDER_API;

export const orderService = {
  postOrder: async (orderData) => { // Returns -> empty
    const response = await api.post(orderApi, orderData);
    return response;
  },
  postPaymentLine: async (paymentData) => { // Returns -> boolean
    const reponse = await api.post(`${orderApi}/payment`, paymentData);
    return reponse;
  },
  getOrders: async () => { // Returns -> list of orders
    const response = await api.get(orderApi);
    return response.data;
  },
  getOrderByNumber: async (number) => { // Returns -> single order
    const response = await api.get(`${orderApi}/${number}`);
    return response.data;
  },
  getOrderSumUnplaced: async () => { // Returns -> sum of unplaced order
    const response = await api.get(`${orderApi}/sum`);
    return response.data;
  },
  getOrderByTableId: async (tableId) => { // Returns -> order based on table id
    const response = await api.get(`${orderApi}?table=${tableId}`);
    return response.data;
  },
  getCurrentReceiptNo: async () => { // Returns -> current receipt no
    const response = await api.get(`${orderApi}/current/receipt`);
    return response.data;
  },
  getUnplacedOrders: async () => { // Returns -> list of unplaced order
    const resposne = await api.get(`${orderApi}/unplaced`);
    return resposne.data;
  },
  patchOrder: async (id, patchRequest) => { // Returns -> empty
    const response = await api.patch(`${orderApi}/${id}`, patchRequest);
    return response;
  },
  patchOrderByReceiptNo: async (receiptNo, patchRequest) => { // Returns -> empty
    const response = await api.patch(`${orderApi}/receipt/${receiptNo}`, patchRequest);
    return response;
  },
  patchOrdersByReceiptNo: async (receiptNo, patchRequest) => { // Returns -> empty
    const response  = await api.patch(`${orderApi}/receipt/existing/${receiptNo}`, patchRequest);
    return response;
  },
  patchRetrieveOrderByReceiptNo: async (receiptNo, patchRequest) => { // Returns -> empty
    const response = await api.patch(`${orderApi}/retrieve/${receiptNo}`, patchRequest);
    return response;
  },
  deleteOrder: async (deleteRequest) => { // Returns -> empty
    const response = await api.delete(orderApi, { data: deleteRequest});
    return response;
  }
}