// Set to true for development, false for production
const isDev = true;

// Enable detailed logging for API requests
const enableDebugLogs = false;

// Base URLs for different environments
const DEV_API_URL = 'http://10.0.2.2:3000/api'; // Android emulator
const IOS_DEV_API_URL = 'http://localhost:3000/api'; // iOS simulator
const DEVICE_API_URL = 'http://192.168.64.117:3000/api'; // Physical device
const WEB_DEV_API_URL = 'http://localhost:3000/api'; // Web browser
const PROD_API_URL = 'https://your-production-api.com/api'; // Production

// Platform detection
const getPlatformInfo = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      return { isWeb: true, isIOS: false, isAndroid: false, isPhysicalDevice: false };
    }
    
    // This will only work in a React Native environment
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      const { Platform } = require('react-native');
      const Constants = require('expo-constants').default;
      
      const isIOS = Platform.OS === 'ios';
      const isAndroid = Platform.OS === 'android';
      
      // Check if running on a physical device or simulator/emulator
      const isPhysicalDevice = !Constants.isDevice;
      
      return { isWeb: false, isIOS, isAndroid, isPhysicalDevice };
    }
    return { isWeb: false, isIOS: false, isAndroid: false, isPhysicalDevice: false };
  } catch (e) {
    // Fallback: if we can access window, assume we're in a browser
    if (typeof window !== 'undefined') {
      return { isWeb: true, isIOS: false, isAndroid: false, isPhysicalDevice: false };
    }
    return { isWeb: false, isIOS: false, isAndroid: false, isPhysicalDevice: false };
  }
};

// Determine the appropriate API URL based on environment and platform
export const getApiUrl = () => {
  if (isDev) {
    const { isWeb, isIOS, isAndroid, isPhysicalDevice } = getPlatformInfo();
    
    let apiUrl;
    if (isWeb) {
      apiUrl = WEB_DEV_API_URL;
    } else if (isPhysicalDevice) {
      apiUrl = DEVICE_API_URL;
    } else if (isIOS) {
      apiUrl = IOS_DEV_API_URL;    } else {
      apiUrl = DEV_API_URL;
    }
    
    return apiUrl;
  }
  return PROD_API_URL;
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
};

// API endpoints
export const ENDPOINTS = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  SET_ADMIN: '/user/:id/set-admin',
  REMOVE_ADMIN: '/user/:id/remove-admin',
  CARS: '/cars/all',
  CARS_BASE: '/cars',
  CHATS: '/chats',
  CHAT_MESSAGES: '/chats/:id/messages',
  USER_CHATS: '/chats/user/:userId',
  // Reservation endpoints
  RESERVATIONS: '/reservations',
  USER_RESERVATIONS: '/reservations/user',
  RESERVATION_DETAILS: '/reservations/:id',
  CANCEL_RESERVATION: '/reservations/:id/cancel',
};

// API timeouts
export const API_TIMEOUT = 10000; // 10 seconds