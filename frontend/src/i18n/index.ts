import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const i18n = new I18n({
    en: require('./en.json'),
    pt: require('./pt.json'),
});

// Set default locale based on device settings
const deviceLocale = getLocales()[0]?.languageCode ?? 'en';

// Initialize with device locale, will be updated when AsyncStorage is checked
i18n.locale = deviceLocale;

// Language storage key
export const LANGUAGE_STORAGE_KEY = '@app_language';

// Function to load saved language
export const loadSavedLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage) {
            i18n.locale = savedLanguage;
            return savedLanguage;
        }
    } catch (error) {
        console.error('Error loading saved language:', error);
    }
    return deviceLocale;
};

// Function to save language preference
export const saveLanguagePreference = async (language: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        console.error('Error saving language preference:', error);
    }
};

export default i18n;