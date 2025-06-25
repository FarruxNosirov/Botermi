import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import ru from './translations/ru';
import uz from './translations/uz';
import { languages } from '@/types/language';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uz: { translation: uz },
  },
  lng: languages[0].code, // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
