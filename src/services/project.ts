import { API } from 'config/constans';
import { CreateProjectData } from 'models/project';
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

}
