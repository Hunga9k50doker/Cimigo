import { API } from 'config/constans';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    debug: true,
    //lng: localStorage.getItem('lang') || 'vi',
    load: 'languageOnly',
    fallbackLng: 'vi',
    ns: ['common'],
    defaultNS: 'common',
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      nsMode: 'default',
    },
    detection: {
      lookupQuerystring: 'lang',
      lookupCookie: 'lang',
      lookupLocalStorage: 'lang',
      lookupSessionStorage: 'lang',
    },
    backend: {
      loadPath: process.env.REACT_APP_BASE_API_URL + API.TRANSLATION.DEFAULT,
    }
  });

export default i18n;