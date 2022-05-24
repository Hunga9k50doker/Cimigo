import { API } from 'config/constans';
import { ChangePaymentMethodParams, CheckoutParams, TryAgain, UpdateConfirmPayment } from 'models/payment';
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

  static async onePayCallback(data: any): Promise<any> {
    return await api.post(`${API.PAYMENT.ONEPAY_CALLBACK}`, data)
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

  static async validConfirm(projectId: number): Promise<any> {
    return await api.get(`${API.PAYMENT.VALID_CONFIRM}`, {
      params: {
        projectId
      }
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async cancel(id: number): Promise<any> {
    return await api.put(API.PAYMENT.CANCEL.replace(':id', `${id}`))
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async tryAgain(id: number, data: TryAgain): Promise<any> {
    return await api.put(API.PAYMENT.TRY_AGAIN.replace(':id', `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async changePaymentMethod(id: number, data: ChangePaymentMethodParams): Promise<any> {
    return await api.put(`${API.PAYMENT.CHANGE_PAYMENT_METHOD.replace(':id', `${id}`)}`, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getInvoice(projectId: number) {
    return await api.get(API.PAYMENT.INVOICE, {
      params: {
        projectId
      },
      responseType: 'blob'
    })
      .catch(async (e) => {
        return Promise.reject(JSON.parse(await e?.response?.data?.text() || '{}'));
      })
  }

  static async getInvoiceDemo(projectId: number) {
    return await api.get(API.PAYMENT.INVOICE_DEMO, {
      params: {
        projectId
      },
      responseType: 'blob'
    })
      .catch(async (e) => {
        return Promise.reject(JSON.parse(await e?.response?.data?.text() || '{}'));
      })
  }
}