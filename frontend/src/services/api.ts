// API Configuration
// Change this to your backend server URL
// For local development, use your machine's IP address (e.g., http://192.168.1.100:5001)
// For Android emulator, use http://10.0.2.2:5001
// For iOS simulator, use http://localhost:5001
export const API_BASE_URL = __DEV__
  ? "http://192.168.18.6:5001" // Your current machine IP
  : "https://your-production-api.com";

// Timeout for API requests (15 seconds)
const API_TIMEOUT = 15000;

// SECURITY: Token storage - NEVER log or display tokens
// In-memory token storage (fallback if AsyncStorage is not available)
let authTokenMemory: string | null = null;

// Helper function to get auth token from storage
// SECURITY: Token is kept in secure storage only
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      authTokenMemory = token;
      return token;
    }
  } catch (error) {
    // Fallback to memory storage - do not log token details
  }
  return authTokenMemory;
};

// Helper function to save auth token to storage
// SECURITY: Token is stored securely, never shown to user
export const saveAuthToken = async (token: string): Promise<void> => {
  authTokenMemory = token;
  try {
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    // Fallback to memory storage - do not log token
  }
};

// Helper function to remove auth token from storage
export const removeAuthToken = async (): Promise<void> => {
  authTokenMemory = null;
  try {
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    // Fallback to memory - do not log
  }
};

// Helper function to make API calls with authentication and timeout
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    // Check if it was a timeout error
    if (error.name === "AbortError") {
      throw new Error("Request timeout - check your network connection");
    }
    throw error;
  }
};
