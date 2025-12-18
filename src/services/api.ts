// API service layer for deNoise FastAPI backend
// Configure this URL for your Render deployment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ============================================================================
// Types
// ============================================================================

export interface ChatRequest {
  prompt: string;
  user_id: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export interface ReportRequest {
  topics: string;
  time_range: string;
  structure: string;
  user_id: string;
}

export interface ReportResponse {
  report: string;
  timestamp: string;
}

export interface PodcastRequest {
  topics: string;
  time_range: string;
  structure: string;
  user_id: string;
}

export interface PodcastResponse {
  script: string;
  audio_url: string;
  timestamp: string;
}

export interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  system_instructions: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ============================================================================
// Health Check
// ============================================================================

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<HealthResponse>(response);
}

// ============================================================================
// Chat API
// ============================================================================

export async function sendChatMessage(prompt: string, userId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, user_id: userId }),
  });
  return handleResponse<ChatResponse>(response);
}

export async function clearChatSession(userId: string): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/chat/clear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  return handleResponse<{ status: string; message: string }>(response);
}

// ============================================================================
// Report API
// ============================================================================

export async function generateReport(request: ReportRequest): Promise<ReportResponse> {
  const response = await fetch(`${API_BASE_URL}/api/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<ReportResponse>(response);
}

// ============================================================================
// Podcast API
// ============================================================================

export async function generatePodcast(request: PodcastRequest): Promise<PodcastResponse> {
  const response = await fetch(`${API_BASE_URL}/api/podcast/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<PodcastResponse>(response);
}

export function getPodcastDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/api/podcast/download/${filename}`;
}

// ============================================================================
// User Profile API
// ============================================================================

export async function getUserInstructions(userId: string): Promise<{ user_id: string; instructions: string }> {
  const response = await fetch(`${API_BASE_URL}/api/user/${userId}/instructions`);
  return handleResponse<{ user_id: string; instructions: string }>(response);
}

// Note: Profile sync endpoint would be added when CosmosDB service is fully implemented
export async function syncUserProfile(profile: UserProfile): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  return handleResponse<void>(response);
}
