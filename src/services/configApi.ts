import { EKey } from './../models/general';
import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
});

api.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang');
    const token = localStorage.getItem(EKey.TOKEN);
    if (token) config.headers.common['Authorization'] = `Bearer ${token}`;
    if (lang) config.headers.common['lang'] = lang;
    return config;
  }
);

export default api;

