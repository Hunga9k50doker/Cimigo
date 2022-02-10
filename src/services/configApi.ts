import axios from 'axios';

const lang = localStorage.getItem('lang');

const getToken = () => {
  const persistJson = localStorage.getItem('persist:root');
  const auth: {
    token: string;
  } = JSON.parse(JSON.parse(persistJson || '{}').auth || '{}');
  return auth.token
}

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
});

export const setToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token)
      config.headers.common['Authorization'] = `Bearer ${token}`;
    if (lang) config.headers.common['lang'] = lang;
    return config;
  }
);

export default api;

