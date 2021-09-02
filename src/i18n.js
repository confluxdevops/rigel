import i18next from 'i18next'
import {initReactI18next} from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `./locales/{{lng}}.json`,
    },
    react: {
      //TODO: modify useSuspense to true
      useSuspense: false,
    },
    // TODO: remove when publish
    debug: true,
    fallbackLng: 'en',
    preload: ['en'],
    interpolation: {escapeValue: false},
  })

export default i18next
