// api.ts
// API Configuration (Works for Hotspot + LAN + Mobile A / Mobile B)
// No need to hardcode IP anymore 

import Constants from "expo-constants";
import { Platform } from "react-native";

//  Your backend port (Change if you use different port)
const BACKEND_PORT = 5001;

// Timeout for API requests (15 seconds)
const API_TIMEOUT = 15000;

//  Dynamically detect Laptop IP from Expo's host URI
const getDevBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    "";

  // hostUri looks like: "192.168.43.120:19000"
  const ip = hostUri.split(":")[0];

  // fallback if not detected
  if (!ip) {
    return Platform.OS === "web"
      ? `http://localhost:${BACKEND_PORT}`
      : `http://localhost:${BACKEND_PORT}`;
  }

  //  Mobile devices must use Laptop IP
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return `http://${ip}:${BACKEND_PORT}`;
  }

  //  Web / Desktop
  return `http://localhost:${BACKEND_PORT}`;
};

export const API_BASE_URL = __DEV__
  ? getDevBaseUrl()
  : "https://your-production-api.com";

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
