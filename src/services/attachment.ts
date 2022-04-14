import { API } from "config/constans";
import api from "./configApi";

export class AttachmentService {
  static async download(id: number) {
    return await api.get(API.ATTACHMENT.DOWNLOAD.replace(":id", `${id}`), {
      responseType: 'blob'
    })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
}