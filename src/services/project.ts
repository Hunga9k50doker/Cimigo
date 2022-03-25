import { API } from 'config/constans';
import { CreateProjectData, GetMyProjects, MoveProject } from 'models/project';
import api from 'services/configApi';

export class ProjectService {
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


}
