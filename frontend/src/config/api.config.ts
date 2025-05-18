// API Configuration
import {
  API_URL,
  ANDROID_API_URL,
  IOS_API_URL,
  PHYSICAL_DEVICE_API_URL
} from '@env';

// Determine if we're running in a development environment
const isDev = process.env.NODE_ENV === 'development';

// Base URLs for different environments
const DEV_API_URL = ANDROID_API_URL || 'http://10.0.2.2:3000/api'; // Android emulator
const IOS_DEV_API_URL = IOS_API_URL || 'http://localhost:3000/api'; // iOS simulator
const DEVICE_API_URL = PHYSICAL_DEVICE_API_URL || 'http://192.168.64.117:3000/api'; // Physical device
const PROD_API_URL = API_URL || 'https://your-production-api.com/api'; // Production

// Platform detection
const getPlatformInfo = () => {
  try {
    // This will only work in a React Native environment
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      const { Platform } = require('react-native');
      const Constants = require('expo-constants').default;
      
      const isIOS = Platform.OS === 'ios';
      const isAndroid = Platform.OS === 'android';
      
      // Check if running on a physical device or simulator/emulator
      const isPhysicalDevice = !Constants.isDevice;
      
      return { isIOS, isAndroid, isPhysicalDevice };
    }
    return { isIOS: false, isAndroid: false, isPhysicalDevice: false };
  } catch (e) {
    return { isIOS: false, isAndroid: false, isPhysicalDevice: false };
  }
};

// Determine the appropriate API URL based on environment and platform
export const getApiUrl = () => {
  if (isDev) {
    const { isIOS, isAndroid, isPhysicalDevice } = getPlatformInfo();
    
    if (isPhysicalDevice) {
      return DEVICE_API_URL;
    } else if (isIOS) {
      return IOS_DEV_API_URL;
    } else {
      return DEV_API_URL;
    }
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
  CARS: '/cars',
};

// API timeouts
export const API_TIMEOUT = 10000; // 10 seconds