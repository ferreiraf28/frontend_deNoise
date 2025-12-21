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
  // Handles both flows:
  // 1. Login: Blocks if user MISSING.
  // 2. Signup: Blocks if user EXISTS.
  // =========================================================================
  const authenticateUser = async (email: string, mode: 'login' | 'signup') => {
    try {
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
      
      let currentDisplayName = "";
      let currentInstructions = "";
      let userExists = false;

      // 1. CHECK EXISTENCE (Read from DB)
      try {
        const existingProfile = await getUserInstructions(userId);
        // API returned 200 OK -> User Exists
        userExists = true;
        currentDisplayName = existingProfile.display_name || "";
        currentInstructions = existingProfile.instructions || "";
      } catch (err) {
        // API returned 404 (or other error) -> User Missing
        userExists = false;
      }

      // 2. LOGIC GATES
      
      // Case A: User tries to SIGN UP but already exists -> BLOCK
      if (mode === 'signup' && userExists) {
        return { error: new Error("Account already exists. Please sign in.") };
      }

      // Case B: User tries to LOG IN but doesn't exist -> BLOCK
      if (mode === 'login' && !userExists) {
        return { error: new Error("Account not found. Please sign up first.") };
      }

      // 3. WRITE TO DB (Sync)
      // This runs for new valid signups OR existing valid logins (to keep data fresh)
      await syncUserProfile({
        user_id: userId,
        email: email,
        display_name: currentDisplayName,
        system_instructions: currentInstructions
      });

      // 4. UPDATE LOCAL STATE
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

  const signIn = async (email: string, password: string) => {
    return authenticateUser(email, 'login');
  };

  const signUp = async (email: string, password: string) => {
    return authenticateUser(email, 'signup');
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