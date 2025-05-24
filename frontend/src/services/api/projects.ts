import axios from 'axios';
import { Project, TeamMemberFormData } from '../../types/project';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const projectsApi = {
  getProjects: async () => {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response.data;
  },

  createProject: async (project: Partial<Project>) => {
    const response = await axios.post(`${API_URL}/projects`, project);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<Project>) => {
    const response = await axios.put(`${API_URL}/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    await axios.delete(`${API_URL}/projects/${id}`);
    return id;
  },

  addTeamMember: async (projectId: string, member: TeamMemberFormData) => {
    const response = await axios.post(`${API_URL}/projects/${projectId}/team`, member);
    return response.data;
  },

  updateTeamMember: async (projectId: string, memberId: string, data: TeamMemberFormData) => {
    const response = await axios.put(`${API_URL}/projects/${projectId}/team/${memberId}`, data);
    return response.data;
  },

  removeTeamMember: async (projectId: string, memberId: string) => {
    const response = await axios.delete(`${API_URL}/projects/${projectId}/team/${memberId}`);
    return response.data;
  }
}; 