import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { GlobalStateProvider } from "@/context/GlobalStateContext";

// Page Imports
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Report from "./pages/Report";
import Podcast from "./pages/Podcast";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// This component handles the layout logic (Sidebar vs Auth page)
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  // Case 1: Auth Page (No Sidebar)
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    );
  }

  // Case 2: Main App (With Sidebar)
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 relative">
        <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4">
          <SidebarTrigger />
        </header>
        
        {/* This is where the "other routes" actually go */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Fixed: Changed Index to Home */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/report" element={<Report />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <GlobalStateProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <AppContent />
            </SidebarProvider>
          </BrowserRouter>
        </GlobalStateProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;