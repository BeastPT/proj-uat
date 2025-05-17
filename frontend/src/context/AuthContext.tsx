import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

// Define the user type
type User = {
  id: string;
  name: string;
  email: string;
} | null;

// Define the context type
type AuthContextType = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  isLoading: false,
});

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Check if the user is authenticated and redirect accordingly
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not authenticated
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Redirect to the home page if authenticated
      router.replace("/(tabs)");
    }
  }, [user, segments]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Here you would implement actual authentication logic
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set the user
      setUser({
        id: "1",
        name: "John Doe",
        email: email,
      });
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Here you would implement actual registration logic
      // For now, we'll just simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set the user
      setUser({
        id: "1",
        name: name,
        email: email,
      });
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
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