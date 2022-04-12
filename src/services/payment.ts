import { API } from 'config/constans';
import { CheckoutParams } from 'models/payment';
import api from 'services/configApi';

export class PaymentService {
  static async checkout(data: CheckoutParams): Promise<any> {
    return await api.post(`${API.PAYMENT.CHECKOUT}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}