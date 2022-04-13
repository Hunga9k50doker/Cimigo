import { API } from 'config/constans';
import { GetConfigsParams, UpdateConfig } from 'models/Admin/config';
import api from 'services/configApi';

export class AdminConfigService {
  static async getConfigs(data: GetConfigsParams): Promise<any> {
    return await api.get(API.ADMIN.CONFIG.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getConfig(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.CONFIG.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateConfig): Promise<any> {
    return await api.put(`${API.ADMIN.CONFIG.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}

export default AdminConfigService