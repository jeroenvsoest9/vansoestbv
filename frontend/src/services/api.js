const axios = require("axios");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Create axios instance with default config
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        getErrorMessage(error.response?.status),
    };
    return Promise.reject(customError);
  },
);

// Error message mapping (Dutch)
const getErrorMessage = (status) => {
  const messages = {
    400: "Ongeldige aanvraag",
    401: "Niet geautoriseerd",
    403: "Geen toegang",
    404: "Niet gevonden",
    409: "Conflict met bestaande gegevens",
    422: "Validatie fout",
    500: "Server fout",
    default: "Er is een fout opgetreden",
  };
  return messages[status] || messages.default;
};

// Auth endpoints
const auth = {
  register: (userData) => instance.post("/auth/register", userData),
  login: (credentials) => instance.post("/auth/login", credentials),
  getCurrentUser: () => instance.get("/auth/me"),
  updateProfile: (profileData) => instance.put("/auth/profile", profileData),
  changePassword: (passwordData) =>
    instance.put("/auth/change-password", passwordData),
};

// Project endpoints
const projects = {
  getAll: (params) => instance.get("/projects", { params }),
  getById: (id) => instance.get(`/projects/${id}`),
  create: (projectData) => instance.post("/projects", projectData),
  update: (id, projectData) => instance.put(`/projects/${id}`, projectData),
  delete: (id) => instance.delete(`/projects/${id}`),
  // Team management
  addTeamMember: (id, userData) =>
    instance.post(`/projects/${id}/team`, userData),
  removeTeamMember: (id, userId) =>
    instance.delete(`/projects/${id}/team/${userId}`),
  // Stakeholder management
  addStakeholder: (id, stakeholderData) =>
    instance.post(`/projects/${id}/stakeholders`, stakeholderData),
  removeStakeholder: (id, stakeholderId) =>
    instance.delete(`/projects/${id}/stakeholders/${stakeholderId}`),
  // Risk management
  addRisk: (id, riskData) => instance.post(`/projects/${id}/risks`, riskData),
  updateRisk: (id, riskId, riskData) =>
    instance.put(`/projects/${id}/risks/${riskId}`, riskData),
  deleteRisk: (id, riskId) =>
    instance.delete(`/projects/${id}/risks/${riskId}`),
  // Issue management
  addIssue: (id, issueData) =>
    instance.post(`/projects/${id}/issues`, issueData),
  updateIssue: (id, issueId, issueData) =>
    instance.put(`/projects/${id}/issues/${issueId}`, issueData),
  deleteIssue: (id, issueId) =>
    instance.delete(`/projects/${id}/issues/${issueId}`),
};

// Invoice endpoints
const invoices = {
  getAll: (params) => instance.get("/invoices", { params }),
  getById: (id) => instance.get(`/invoices/${id}`),
  create: (invoiceData) => instance.post("/invoices", invoiceData),
  update: (id, invoiceData) => instance.put(`/invoices/${id}`, invoiceData),
  delete: (id) => instance.delete(`/invoices/${id}`),
  generatePdf: (id) =>
    instance.get(`/invoices/${id}/pdf`, { responseType: "blob" }),
};

module.exports = {
  auth,
  projects,
  invoices,
};
