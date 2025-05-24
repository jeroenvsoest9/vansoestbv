import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Project, TeamMemberFormData } from "../../types/project";
import { projectsApi } from "../../services/api/projects";

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async () => {
    const response = await projectsApi.getProjects();
    return response.projects;
  },
);

export const fetchProject = createAsyncThunk(
  "projects/fetchProject",
  async (id: string) => {
    const response = await projectsApi.getProject(id);
    return response;
  },
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (project: Partial<Project>) => {
    const response = await projectsApi.createProject(project);
    return response;
  },
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }: { id: string; data: Partial<Project> }) => {
    const response = await projectsApi.updateProject(id, data);
    return response;
  },
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string) => {
    await projectsApi.deleteProject(id);
    return id;
  },
);

export const addTeamMember = createAsyncThunk(
  "projects/addTeamMember",
  async ({
    projectId,
    member,
  }: {
    projectId: string;
    member: TeamMemberFormData;
  }) => {
    const response = await projectsApi.addTeamMember(projectId, member);
    return response;
  },
);

export const updateTeamMember = createAsyncThunk(
  "projects/updateTeamMember",
  async ({
    projectId,
    memberId,
    data,
  }: {
    projectId: string;
    memberId: string;
    data: TeamMemberFormData;
  }) => {
    const response = await projectsApi.updateTeamMember(
      projectId,
      memberId,
      data,
    );
    return response;
  },
);

export const removeTeamMember = createAsyncThunk(
  "projects/removeTeamMember",
  async ({ projectId, memberId }: { projectId: string; memberId: string }) => {
    const response = await projectsApi.removeTeamMember(projectId, memberId);
    return response;
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      })
      // Fetch Single Project
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch project";
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create project";
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update project";
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete project";
      })
      // Add Team Member
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(addTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add team member";
      })
      // Update Team Member
      .addCase(updateTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update team member";
      })
      // Remove Team Member
      .addCase(removeTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(removeTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove team member";
      });
  },
});

export const { clearCurrentProject, clearError } = projectsSlice.actions;

export default projectsSlice.reducer;
