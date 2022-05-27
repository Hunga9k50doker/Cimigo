import { API } from 'config/constans';
import { AdminGetProjects } from 'models/Admin/project';
import api from 'services/configApi';

export class AdminProjectService {
  static async getProjects(data: AdminGetProjects): Promise<any> {
    return await api.get(API.ADMIN.PROJECT.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getProject(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getQuotas(id: number): Promise<any> {
    return await api.get(`${API.ADMIN.PROJECT.QUOTA.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async update(id: number, data: FormData) {
    return await api.put(`${API.ADMIN.PROJECT.DEFAULT}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async delete(id: number): Promise<any> {
    return await api.delete(`${API.ADMIN.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

}
