import { API } from 'config/constans';
import { GetSchedulePreview, MakeAnOrder } from 'models/schedule';
import api from 'services/configApi';

export class ScheduleService {
  static async getSchedulePreview(data: GetSchedulePreview): Promise<any> {
    return await api
      .get(API.PAYMENT.SCHEDULE_PREVIEW, { params: data })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
  static async makeAnOrder(data: MakeAnOrder): Promise<any> {
    return await api
      .post(API.PAYMENT.MAKE_AN_ORDER, data)
      .then((res) => {
        return Promise.resolve(res.data.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
