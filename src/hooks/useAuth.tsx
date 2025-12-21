import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// 1. Import the API service to talk to the Backend
import { syncUserProfile } from "@/services/api";

// Simple user type for local auth
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
    // Load user from localStorage on mount
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

  const signIn = async (email: string, password: string) => {
    try {
      // Generate ID from email (Mock Logic)
      const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
      
      const newUser: User = {
        id: userId,
        email,
        display_name: '',
        system_instructions: '',
      };
      
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    // 2. Perform local sign-in logic first
    const result = await signIn(email, password);
    
    // 3. If successful, SYNC with CosmosDB immediately
    if (!result.error) {
        // Re-generate ID to ensure we have it (or grab from result logic if refactored)
        const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
        
        try {
            await syncUserProfile({
                user_id: userId,
                email: email,
                display_name: "", // Default empty
                system_instructions: "" // Default empty
            });
            console.log("User synced to CosmosDB on signup");
        } catch (err) {
            console.error("Failed to sync new user to backend:", err);
            // We don't block the UI flow here, just log the error
        }
    }

    return result;
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



/*
TO DO:
- Fazer com que o profile seja criado na base dados assim que acontece o log in ou sign up
- adicionar função para conseguir dar display do nome no frontend (que neste momento nao ta a ir buscar) e passar o nome para o prompt assim como as custom instructions
*/