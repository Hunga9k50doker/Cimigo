import { API } from "config/constans";
import { Create, GetTypes } from "models/custom_question";
import api from "services/configApi";

export class CustomQuestionService {
  static async create(data: Create): Promise<any> {
    return await api
      .post(API.CUSTOM_QUESTION.DEFAULT, data)
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }

  static async getTypes(data: GetTypes): Promise<any> {
    return await api
      .get(API.CUSTOM_QUESTION.GET_TYPES, {
        params: data,
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      });
  }
}
