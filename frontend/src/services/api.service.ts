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
          console.log('Token expired, clearing tokens to force re-login');
          await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
          await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
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
      const response: AxiosResponse = await apiClient.get(`${ENDPOINTS.CARS_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get car by ID error:', error);
      throw error;
    }
  }
  
  async createCar(carData: any): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.post(ENDPOINTS.CARS_BASE, carData);
      return response.data;
    } catch (error) {
      console.error('Create car error:', error);
      throw error;
    }
  }

  async updateCar(id: string, carData: any): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.put(`${ENDPOINTS.CARS_BASE}/${id}`, carData);
      return response.data;
    } catch (error) {
      console.error('Update car error:', error);
      throw error;
    }
  }

  async deleteCar(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.delete(`${ENDPOINTS.CARS_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete car error:', error);
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
      console.error('Set user as admin error:', error);
      throw error;
    }
  }

  async removeUserAdmin(userId: string): Promise<any> {
    try {
      const endpoint = ENDPOINTS.REMOVE_ADMIN.replace(':id', userId);
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      console.error('Remove user admin error:', error);
      throw error;
    }
  }

  // Chat endpoints
  async getAdminChats(): Promise<any> {
    try {
      const response: AxiosResponse = await apiClient.get(ENDPOINTS.CHATS);
      return response.data;
    } catch (error) {
      console.error('Get admin chats error:', error);
      throw error;
    }
  }

  async getUserChats(userId: string): Promise<any> {
    try {
      console.log(`Getting chats for user: ${userId}`);
      
      if (!userId) {
        console.error('Missing user ID in getUserChats');
        throw new Error('User ID is required');
      }
      
      const endpoint = ENDPOINTS.USER_CHATS.replace(':userId', userId);
      console.log(`Using endpoint: ${endpoint}`);
      
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.get(endpoint);
      console.log(`Retrieved ${response.data?.length || 0} chats for user ${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get user chats error:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error;
    }
  }

  async getChatById(chatId: string): Promise<any> {
    try {
      const endpoint = `${ENDPOINTS.CHATS}/${chatId}`;
      const response: AxiosResponse = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get chat by ID error:', error);
      throw error;
    }
  }

  async createChat(userId: string): Promise<any> {
    try {
      console.log(`Creating chat for user: ${userId}`);
      
      if (!userId) {
        console.error('Missing user ID in createChat');
        throw new Error('User ID is required');
      }
      
      const endpoint = ENDPOINTS.CHATS;
      console.log(`Using endpoint: ${endpoint}`);
      
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.post(endpoint, { userId });
      console.log(`Chat created successfully for user ${userId}, chat ID: ${response.data?.id || 'unknown'}`);
      return response.data;
    } catch (error: any) {
      console.error('Create chat error:', error);
      
      // Handle 409 Conflict (chat already exists) specially
      if (error.response && error.response.status === 409) {
        console.log('Chat already exists, extracting existing chat ID');
        
        if (error.response.data && error.response.data.chatId) {
          console.log(`Using existing chat ID: ${error.response.data.chatId}`);
          return {
            id: error.response.data.chatId,
            isActive: true,
            userId: userId
          };
        } else {
          console.error('No chat ID found in 409 response');
        }
      }
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
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
      console.error('Get chat messages error:', error);
      throw error;
    }
  }

  async sendMessage(chatId: string, content: string, isAdmin: boolean = false): Promise<any> {
    try {
      console.log(`Sending message to chat ${chatId}: "${content.substring(0, 20)}${content.length > 20 ? '...' : ''}"`);
      
      const endpoint = ENDPOINTS.CHAT_MESSAGES.replace(':id', chatId);
      console.log('Using endpoint:', endpoint);
      
      // Log the request payload
      console.log('Request payload:', { content, isAdmin });
      
      // Check if we have a valid token before sending
      const token = await this.getToken();
      if (!token) {
        console.error('No authentication token available');
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response: AxiosResponse = await apiClient.post(endpoint, {
        content,
        isAdmin
      });
      
      console.log('Message sent successfully, response:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('Send message error:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error;
    }
  }

  async closeChat(chatId: string): Promise<any> {
    try {
      const endpoint = `${ENDPOINTS.CHATS}/${chatId}/close`;
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      console.error('Close chat error:', error);
      throw error;
    }
  }

  async reopenChat(chatId: string): Promise<any> {
    try {
      const endpoint = `${ENDPOINTS.CHATS}/${chatId}/reopen`;
      const response: AxiosResponse = await apiClient.put(endpoint);
      return response.data;
    } catch (error) {
      console.error('Reopen chat error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();