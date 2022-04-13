import { API } from 'config/constans';
import { CheckoutParams, UpdateConfirmPayment } from 'models/payment';
import api from 'services/configApi';

export class PaymentService {
  static async checkout(data: CheckoutParams): Promise<any> {
    return await api.post(`${API.PAYMENT.CHECKOUT}`, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  static async updateConfirmPayment(data: UpdateConfirmPayment): Promise<any> {
    return await api.put(`${API.PAYMENT.CONFIRM}`, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}