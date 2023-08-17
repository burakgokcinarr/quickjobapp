import  i18n  from "i18next";
import { initReactI18next } from 'react-i18next';
import { getLocales, getCalendars } from 'expo-localization';

import { TRANSLATIONS_TR } from './lang/tr';
import { TRANSLATIONS_EN } from './lang/en';
import { TRANSLATIONS_DE } from "./lang/de";

i18n
.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: {
        tr: {
            translation: TRANSLATIONS_TR
        },
        en: {
            translation: TRANSLATIONS_EN
        },
        de: {
            translation: TRANSLATIONS_DE
        }
    },
    lng: getLocales()[0].languageCode,          // tr, en, de vs..              // Debug modda sıkıntı cıkartıyor. getLocales()[0].languageCode yerine "tr" yazarak debug yapılabilir.
    fallbackLng: 'tr',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;