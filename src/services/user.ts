import api from './configApi';
import { API } from 'config/constans';
import { ForgotPasswordData, LoginForm, RegisterData, SocialLoginData,User } from 'models/user';

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
  static async update(data: User): Promise<any> {
    return await api.put(`${API.USER.UPDATE_PROFILE}`, data, {
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

  static async register(data: RegisterData) {
    return await api.post(API.AUTH.REGISTER, data)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async active(code: string) {
    return await api.post(API.AUTH.ACTIVE, {
      code
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async sendEmailForgotPassword(email: string) {
    return await api.post(API.AUTH.SEND_EMAIL_FORGOT_PASSWORD, {
      email
    })
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async forgotPassword(data: ForgotPasswordData) {
    return await api.post(API.AUTH.FORGOT_PASSWORD, data)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }

  static async getPaymentInfo() {
    return await api.get(API.USER.PAYMENT_INFO)
      .then((res) => {
        return Promise.resolve(res.data.data)
      })
      .catch((e) => {
        return Promise.reject(e?.response?.data);
      })
  }
  
}

export default UserService