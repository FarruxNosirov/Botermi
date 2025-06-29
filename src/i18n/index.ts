import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './translations/ru';
import uz from './translations/uz';
import { languages } from '@/types/language';

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
  },
  lng: languages[0].code,
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
