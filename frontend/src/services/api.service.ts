import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, STORAGE_KEYS, ENDPOINTS, API_TIMEOUT } from '@/src/config/api.config';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// API service class
class ApiService {
  // Auth endpoints
  async login(email: string, password: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });
      
      // Store tokens
      await this.setTokens(response.data.token, response.data.refreshToken);
      
      return response.data;
    } catch (error: any) {
      // Don't log expected authentication errors (status 400/401)
      if (error.response && (error.response.status !== 400 && error.response.status !== 401)) {
        console.error('Login error:', error);
      }
      throw error;
    }
  }

  async register(name: string, email: string, password: string): Promise<any> {
    try {
      // First register the user
      await apiClient.post(ENDPOINTS.REGISTER, {
        name,
        email,
        password,
      });
      
      // Then login to get the tokens
      return this.login(email, password);
    } catch (error: any) {
      // Don't log expected authentication errors (status 400/401/409)
      if (error.response && (error.response.status !== 400 && error.response.status !== 401 && error.response.status !== 409)) {
        console.error('Registration error:', error);
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateUserProfile(userData: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    birthdate?: string;
  }): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.put(ENDPOINTS.UPDATE_PROFILE, userData);
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Token management
  async setTokens(token: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Car endpoints
  async getCars(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.CARS);
      return response.data;
    } catch (error) {
      console.error('Get cars error:', error);
      throw error;
    }
  }

  async getCarById(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(`${ENDPOINTS.CARS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get car by ID error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();