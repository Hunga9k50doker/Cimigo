import api from './configApi';
import { API } from 'config/constans';
import { LoginForm, SocialLoginData } from 'models/user';

export class UserService {
  static async login(data: LoginForm): Promise<any> {
    return await api.post(API.AUTH.LOGIN, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getMe() {
    return await api.get(API.AUTH.ME)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendVerifyEmail(email: string) {
    return await api.post(API.AUTH.SEND_VERIFY_EMAIL, { email })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async socialLogin(data: SocialLoginData) {
    return await api.post(API.AUTH.LOGIN_SOCIAL, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  
}

export default UserService