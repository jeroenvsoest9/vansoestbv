import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { fetchProject } from '../../store/slices/projectsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ProjectTeam from './ProjectTeam';
import ProjectWorkflow from './ProjectWorkflow';
import ProjectManager from './ProjectManager';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProject: project, loading, error } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="info">Project not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
        >
          Back to Projects
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/projects/${project._id}/edit`)}
        >
          Edit Project
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {project.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Client: {project.client}
          </Typography>
          <Typography variant="body1" paragraph>
            {project.description}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={3}>
            <Box flex="1" minWidth={300}>
              <Typography variant="h6" gutterBottom>
                Project Details
              </Typography>
              <Box>
                <Typography variant="body2">
                  <strong>Type:</strong> {project.type}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {project.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
                </Typography>
                {project.endDate && (
                  <Typography variant="body2">
                    <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Budget:</strong> €{project.budget.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Box flex="1" minWidth={300}>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <Box>
                <Typography variant="body2">
                  {project.address.street}
                </Typography>
                <Typography variant="body2">
                  {project.address.postalCode} {project.address.city}
                </Typography>
                <Typography variant="body2">
                  {project.address.country}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box display="flex" flexDirection="column" gap={3}>
          <ProjectManager project={project} />
          
          <Box display="flex" flexDirection="row" gap={3}>
            <Box flex={2}>
              <ProjectWorkflow project={project} />
            </Box>
            <Box flex={1}>
              <ProjectTeam project={project} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDetails; 