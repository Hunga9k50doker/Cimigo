import { API } from 'config/constans';
import { CreateProjectData, GetMyProjects, MoveProject, RenameProject, UpdateProjectBasicInformation, UpdateTarget } from 'models/project';
import api from 'services/configApi';

export class ProjectService {
  static async getProject(id: number): Promise<any> {
    return await api.get(`${API.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async createProject(data: CreateProjectData): Promise<any> {
    return await api.post(API.PROJECT.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getMyProjects(data: GetMyProjects): Promise<any> {
    return await api.get(API.PROJECT.DEFAULT, { params: data })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async deleteProject(id: number): Promise<any> {
    return await api.delete(`${API.PROJECT.DEFAULT}/${id}`)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async moveProject(id: number, data: MoveProject): Promise<any> {
    return await api.put(API.PROJECT.MOVE.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async renameProject(id: number, data: RenameProject): Promise<any> {
    return await api.put(API.PROJECT.RENAME.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateProjectBasicInformation(id: number, data: UpdateProjectBasicInformation): Promise<any> {
    return await api.put(API.PROJECT.BASIC_INFORMATION.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateTarget(id: number, data: UpdateTarget): Promise<any> {
    return await api.put(API.PROJECT.TARGET.replace(":id", `${id}`), data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async updateSampleSize(id: number, sampleSize: number): Promise<any> {
    return await api.put(API.PROJECT.SAMPLE_SIZE.replace(":id", `${id}`), {
      sampleSize
    })
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  

}
