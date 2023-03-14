import { API } from 'config/constans';
import api from 'services/configApi';
import { UpdateBasicInfo } from 'models/Admin/payment_schedule';

export class AdminPaymentScheduleService {
  static async updateBasicInfo(id: number, data: UpdateBasicInfo): Promise<any> {
    return await api.put(API.ADMIN.PAYMENT_SCHEDULE.UPDATE_BASIC_INFO.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updatePaidStatus(id: number): Promise<any> {
    return await api.put(API.ADMIN.PAYMENT_SCHEDULE.UPDATE_STATUS.replace(":id", `${id}`))
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
