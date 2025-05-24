import axiosInstance, { isAuthResponse, isUser } from "./axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role?: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (!isAuthResponse(response.data)) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register", data);
    if (!isAuthResponse(response.data)) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get("/auth/me");
    if (!isUser(response.data)) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put("/auth/me", data);
    if (!isUser(response.data)) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await axiosInstance.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/auth/users");
    if (!Array.isArray(response.data) || !response.data.every(isUser)) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put(`/auth/users/${userId}`, data);
    if (!isUser(response.data)) {
      throw new Error("Invalid response format");
    }
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await axiosInstance.delete(`/auth/users/${userId}`);
  },
};

export default authApi;
