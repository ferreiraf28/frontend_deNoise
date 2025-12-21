import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { syncUserProfile, getUserInstructions } from "@/services/api";

export interface User {
  id: string;
  email: string;
  display_name?: string;
  system_instructions?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'denoise_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // =========================================================================
  // UNIFIED AUTH LOGIC
  // Since "Sign In" and "Sign Up" behave identically in this system,
  // we use one function to handle both.
  // =========================================================================
  const authenticateUser = async (email: string) => {
    try {
      // 1. Generate ID
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
      
      // 2. READ: Try to get existing data (so we don't overwrite it)
      let currentDisplayName = "";
      let currentInstructions = "";
      
      try {
        const existingProfile = await getUserInstructions(userId);
        currentDisplayName = existingProfile.display_name || "";
        currentInstructions = existingProfile.instructions || "";
      } catch (err) {
        // If 404 (User doesn't exist), that's fine. We stick with empty strings.
      }

      // 3. WRITE: Always sync to DB immediately.
      // This ensures the user record exists, whether it's their 1st or 100th login.
      await syncUserProfile({
        user_id: userId,
        email: email,
        display_name: currentDisplayName,
        system_instructions: currentInstructions
      });

      // 4. Update Local State
      const newUser: User = {
        id: userId,
        email,
        display_name: currentDisplayName,
        system_instructions: currentInstructions,
      };
      
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return { error: null };

    } catch (error) {
      console.error("Auth error:", error);
      return { error: error as Error };
    }
  };

  // Both functions now just call the unified logic
  const signIn = async (email: string, password: string) => {
    return authenticateUser(email);
  };

  const signUp = async (email: string, password: string) => {
    return authenticateUser(email);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};