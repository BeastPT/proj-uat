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

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to get a refresh token
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Implement token refresh logic here if your backend supports it
          // For now, we'll just clear tokens to force re-login
          await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
          await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
      } catch (refreshError) {
        // Silent error handling for token refresh
      }
    }
    
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
      // Don't log expected authentication errors
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
      // Don't log expected authentication errors
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.clearTokens();
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.PROFILE);
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  // Token management
  async setTokens(token: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } catch (error) {
      // Silent error handling for token storage
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      // Silent error handling for token clearing
    }
  }

  // Car endpoints
  async getCars(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.CARS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAvailableCars(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.CARS_AVAILABLE);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get available cars near a specific location
   * @param latitude User's latitude
   * @param longitude User's longitude
   * @param maxDistance Maximum distance in kilometers (optional)
   */
  async getNearbyCars(latitude: number, longitude: number, maxDistance?: number): Promise<any> {
    try {
      const params: Record<string, string | number> = {
        latitude: latitude.toString(),
        longitude: longitude.toString()
      };
      
      if (maxDistance !== undefined) {
        params.maxDistance = maxDistance.toString();
      }
      
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.CARS_NEARBY, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCarById(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(`${ENDPOINTS.CARS_BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async createCar(carData: any): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.post(ENDPOINTS.CARS_BASE, carData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCar(id: string, carData: any): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.put(`${ENDPOINTS.CARS_BASE}/${id}`, carData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCar(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.delete(`${ENDPOINTS.CARS_BASE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin management
  async setUserAsAdmin(userId: string): Promise<any> {
    try {
      const endpoint = ENDPOINTS.SET_ADMIN.replace(':id', userId);
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async removeUserAdmin(userId: string): Promise<any> {
    try {
      const endpoint = ENDPOINTS.REMOVE_ADMIN.replace(':id', userId);
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Chat endpoints
  async getAdminChats(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.CHATS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserChats(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const endpoint = ENDPOINTS.USER_CHATS.replace(':userId', userId);
      
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.get(endpoint);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getChatById(chatId: string): Promise<any> {
    try {
      const endpoint = `${ENDPOINTS.CHATS}/${chatId}`;
      const response: AxiosResponse = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createChat(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const endpoint = ENDPOINTS.CHATS;
      
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.post(endpoint, { userId });
      return response.data;
    } catch (error: any) {
      // Handle 409 Conflict (chat already exists) specially
      if (error.response && error.response.status === 409) {
        if (error.response.data && error.response.data.chatId) {
          return {
            id: error.response.data.chatId,
            isActive: true,
            userId: userId
          };
        }
      }
      
      throw error;
    }
  }

  async getChatMessages(chatId: string): Promise<any> {
    try {
      const endpoint = ENDPOINTS.CHAT_MESSAGES.replace(':id', chatId);
      const response: AxiosResponse = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(chatId: string, content: string, isAdmin: boolean = false): Promise<any> {
    try {
      const endpoint = ENDPOINTS.CHAT_MESSAGES.replace(':id', chatId);
      
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.post(endpoint, {
        content,
        isAdmin
      });
      
      return response.data;
    } catch (error: any) {
      
      
      throw error;
    }
  }

  async closeChat(chatId: string): Promise<any> {
    try {
      const endpoint = `${ENDPOINTS.CHATS}/${chatId}/close`;
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async reopenChat(chatId: string): Promise<any> {
    try {
      const endpoint = `${ENDPOINTS.CHATS}/${chatId}/reopen`;
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Reservation endpoints
  async getUserReservations(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.USER_RESERVATIONS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getReservationById(id: string): Promise<any> {
    try {
      const endpoint = ENDPOINTS.RESERVATION_DETAILS.replace(':id', id);
      const response: AxiosResponse = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createReservation(reservationData: {
    carId: string;
    startDate: string;
    endDate: string;
  }): Promise<any> {
    try {
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.post(ENDPOINTS.RESERVATIONS, reservationData);
      return response.data;
    } catch (error: any) {
      
      throw error;
    }
  }

  async cancelReservation(id: string): Promise<any> {
    try {
      const endpoint = ENDPOINTS.CANCEL_RESERVATION.replace(':id', id);
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const apiService = new ApiService();