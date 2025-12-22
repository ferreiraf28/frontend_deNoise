// Manages global state for chat history, report data, and podcast data (when to clear/refresh the UI state)

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { clearChatSession } from "@/services/api"; 

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    title: string;
    snippet: string;
    date: string;
  }>;
}

interface GlobalState {
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  
  reportData: { content: string; generatedAt: string } | null;
  setReportData: React.Dispatch<React.SetStateAction<{ content: string; generatedAt: string } | null>>;
  
  podcastData: { audioUrl: string | null };
  setPodcastData: React.Dispatch<React.SetStateAction<{ audioUrl: string | null }>>;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  // Track the previous user ID to handle logout cleanup
  const lastUserIdRef = useRef<string | null>(null);

  // Initialize State (Always empty on load/refresh)
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [reportData, setReportData] = useState<{ content: string; generatedAt: string } | null>(null);
  const [podcastData, setPodcastData] = useState<{ audioUrl: string | null }>({ audioUrl: null });

  // SESSION SYNC LOGIC
  useEffect(() => {
    const currentUserId = user?.id;
    const previousUserId = lastUserIdRef.current;

    // SCENARIO 1: LOGOUT
    // User was present (previousUserId), but now is gone (!user)
    if (!currentUserId && previousUserId) {
      console.log("Logout detected: Clearing session for", previousUserId);
      clearChatSession(previousUserId).catch(console.error);
      
      // Clear UI immediately
      setChatHistory([]);
      setReportData(null);
      setPodcastData({ audioUrl: null });
    }

    // SCENARIO 2: NEW SESSION (Login OR Refresh)
    // We have a user now. Since our local UI state (chatHistory) initialized as empty,
    // we must enforce that the backend session is also empty.
    if (currentUserId) {
       // We only clear if the ID actually changed OR if it's the first load (ref is null)
       // This prevents double-clearing if the component just re-renders.
       if (currentUserId !== previousUserId) {
         console.log("New Session (Login/Refresh): Wiping backend memory for", currentUserId);
         clearChatSession(currentUserId).catch(console.error);
         
         // Ensure UI is clean
         setChatHistory([]);
         setReportData(null);
         setPodcastData({ audioUrl: null });
       }
    }

    // Update the ref for the next change
    lastUserIdRef.current = currentUserId || null;

  }, [user]); // Runs whenever the user auth state changes

  return (
    <GlobalStateContext.Provider 
      value={{ 
        chatHistory, setChatHistory, 
        reportData, setReportData, 
        podcastData, setPodcastData 
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};