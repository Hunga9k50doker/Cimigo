import { API } from 'config/constans';
import { CreateAttribute, GetAttributesParams, UpdateAttribute } from 'models/Admin/attribute';
import api from 'services/configApi';

export class AdminAttributeService {

  static async getAttributes(data: GetAttributesParams): Promise<any> {
    return await api.get(API.ADMIN.ATTRIBUTE.DEFAULT, {
      params: data
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getAttribute(id: number, language?: string): Promise<any> {
    return await api.get(`${API.ADMIN.ATTRIBUTE.DEFAULT}/${id}`, {
      params: {
        language
      }
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async create(data: CreateAttribute): Promise<any> {
    return await api.post(API.ADMIN.ATTRIBUTE.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: UpdateAttribute): Promise<any> {
    return await api.put(`${API.ADMIN.ATTRIBUTE.DEFAULT}/${id}`, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.ATTRIBUTE.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }


}
