import { API } from 'config/constans';
import api from 'services/configApi';

export class QuotaService {

  static async getQuotas(projectId: number): Promise<any> {
    return await api.get(API.QUOTA.DEFAULT, {
      params: {
        projectId
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
