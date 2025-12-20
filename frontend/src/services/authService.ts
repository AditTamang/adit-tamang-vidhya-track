import { apiCall, saveAuthToken, removeAuthToken } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "teacher" | "parent" | "student";
  className?: string;
  section?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data?: {
    user: any;
    token: string;
  };
}

// Register user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
};

// Verify registration OTP
// Note: No token is given here - user must wait for admin approval
export const verifyRegistrationOTP = async (
  email: string,
  otp: string
): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/verify-registration", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

  const result = await response.json();

  // Do NOT save token here - admin approval is required first
  // Token will only be given after login (when admin has approved)

  return result;
};

// Login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  // Save token and user data if login successful
  if (result.status === 200 && result.data?.token) {
    await saveAuthToken(result.data.token);
    // Also save user data for profile screens
    if (result.data.user) {
      const AsyncStorage =
        require("@react-native-async-storage/async-storage").default;
      await AsyncStorage.setItem("userData", JSON.stringify(result.data.user));
    }
  }

  return result;
};

// Forgot password
export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  return result;
};

// Verify reset password OTP
export const verifyResetOTP = async (
  email: string,
  otp: string
): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/verify-reset-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

  const result = await response.json();
  return result;
};

// Reset password
export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, newPassword }),
  });

  const result = await response.json();
  return result;
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiCall("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    await removeAuthToken();
    // Also clear user data
    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;
    await AsyncStorage.removeItem("userData");
  }
};

// Resend OTP - sends a new OTP and invalidates the old one
export const resendOTP = async (
  email: string,
  purpose: "registration" | "forgot_password"
): Promise<AuthResponse> => {
  const response = await apiCall("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
  });

  const result = await response.json();
  return result;
};
