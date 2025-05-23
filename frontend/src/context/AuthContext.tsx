import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { apiService } from "@/src/services/api.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the user type
type User = {
  id: string;
  name: string;
  email: string;
  country?: string;
  phone?: string;
  birthdate?: string;
  isVerified?: boolean;
} | null;

// Define the context type
type AuthContextType = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (userData: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    birthdate?: string;
  }) => Promise<void>;
  isLoading: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateProfile: async () => {},
  isLoading: false,
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check token
  const router = useRouter();
  const segments = useSegments();

  // Check for existing token on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await apiService.getToken();
        
        if (token) {
          // If token exists, fetch user profile
          const userProfile = await apiService.getUserProfile();
          setUser({
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            country: userProfile.country,
            phone: userProfile.phone,
            birthdate: userProfile.birthdate,
            isVerified: userProfile.isVerified,
          });
        }
      } catch (error) {
        console.error("Token validation error:", error);
        // If token is invalid, clear it
        await apiService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // Check if the user is authenticated and redirect accordingly
  useEffect(() => {
    if (isLoading) return; // Skip navigation while checking token
    
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to the home page if authenticated
      router.replace("/(tabs)");
    }
  }, [user, segments, isLoading]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Use the API service to authenticate
      const response = await apiService.login(email, password);
      
      // Fetch user profile
      const userProfile = await apiService.getUserProfile();

      // Set the user
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        country: userProfile.country,
        phone: userProfile.phone,
        birthdate: userProfile.birthdate,
        isVerified: userProfile.isVerified,
      });
    } catch (error: any) {
      // Only log unexpected errors, not authentication errors
      if (!error.response || (error.response.status !== 400 && error.response.status !== 401)) {
        console.error("Sign in error:", error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Use the API service to register and login
      await apiService.register(name, email, password);
      
      // Fetch user profile
      const userProfile = await apiService.getUserProfile();
      
      // Set the user
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        country: userProfile.country,
        phone: userProfile.phone,
        birthdate: userProfile.birthdate,
        isVerified: userProfile.isVerified,
      });
    } catch (error: any) {
      // Only log unexpected errors, not authentication errors
      if (!error.response || (error.response.status !== 400 && error.response.status !== 401 && error.response.status !== 409)) {
        console.error("Sign up error:", error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
      setUser(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    birthdate?: string;
  }) => {
    setIsLoading(true);
    try {
      // Use the API service to update the profile
      await apiService.updateUserProfile(userData);
      
      // Fetch updated user profile
      const userProfile = await apiService.getUserProfile();

      // Update the user state
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        country: userProfile.country,
        phone: userProfile.phone,
        birthdate: userProfile.birthdate,
        isVerified: userProfile.isVerified,
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}