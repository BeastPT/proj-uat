import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const i18n = new I18n({
    en: require('./en.json'),
    pt : require('./pt.json'),
});

i18n.locale = getLocales()[0].languageCode ?? 'en';

export default i18n;