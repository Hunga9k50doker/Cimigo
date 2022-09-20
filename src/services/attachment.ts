import { API } from "config/constans";
import api from "./configApi";

export class AttachmentService {
  static async download(id: number) {
    return await api.get(API.ATTACHMENT.DOWNLOAD.replace(":id", `${id}`), {
      responseType: 'blob'
    })
      .catch(async (e) => {
        return Promise.reject(JSON.parse(await e?.response?.data?.text() || '{}'));
      })
  }

  static async downloadBase64(id: number) {
    return await api.get(API.ATTACHMENT.DOWNLOAD_BASE64.replace(":id", `${id}`))
      .catch(async (e) => {
        return Promise.reject(JSON.parse(await e?.response?.data?.text() || '{}'));
      })
  }

  static async downloadByUrl(url: string) {
    return await api.get(API.ATTACHMENT.DOWNLOAD_BY_URL, {
      params: {
        url
      },
      responseType: "blob"
    })
      .catch(async (e) => {
        return Promise.reject(JSON.parse(await e?.response?.data?.text() || '{}'));
      })
  }

  static async blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
      reader.onerror = (e) => reject(e)
    });
  }
}