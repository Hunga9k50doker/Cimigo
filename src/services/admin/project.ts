import { API } from 'config/constans';
import { AdditionalBrand } from 'models/additional_brand';
import { AdminGetProjects } from 'models/Admin/project';
import { CustomQuestion } from 'models/custom_question';
import { Pack } from 'models/pack';
import { Project, ProjectTarget } from 'models/project';
import { ProjectAttribute } from 'models/project_attribute';
import { Quota } from 'models/quota';
import { UserAttribute } from 'models/user_attribute';
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

  static async getProject(id: number): Promise<Project> {
    return await api.get(`${API.ADMIN.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getQuotas(id: number): Promise<Quota[]> {
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

  static async getPacks(id: number): Promise<Pack[]> {
    return await api.get(`${API.ADMIN.PROJECT.PACK.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async eyeTrackingPacks(id: number): Promise<Pack[]> {
    return await api.get(`${API.ADMIN.PROJECT.EYE_TRACKING_PACK.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async additionalBrands(id: number): Promise<AdditionalBrand[]> {
    return await api.get(`${API.ADMIN.PROJECT.ADDITIONAL_BRAND.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async projectAttributes(id: number): Promise<ProjectAttribute[]> {
    return await api.get(`${API.ADMIN.PROJECT.PROJECT_ATTRIBUTE.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async userAttributes(id: number): Promise<UserAttribute[]> {
    return await api.get(`${API.ADMIN.PROJECT.USER_ATTRIBUTE.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getCustomQuestions(id: number): Promise<CustomQuestion[]> {
    return await api.get(`${API.ADMIN.PROJECT.CUSTOM_QUESTION.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getTargets(id: number): Promise<ProjectTarget[]> {
    return await api.get(`${API.ADMIN.PROJECT.TARGET.replace(':id', `${id}`)}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}
