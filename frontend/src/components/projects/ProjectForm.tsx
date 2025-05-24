import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  SelectChangeEvent,
  Grid
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createProject,
  updateProject,
  getProject,
  clearError
} from '../../store/slices/projectsSlice';
import { Project } from '../../services/api/projects';

interface ProjectFormData {
  name: string;
  client: string;
  type: string;
  status: Project['status'];
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

const initialFormData: ProjectFormData = {
  name: '',
  client: '',
  type: '',
  status: 'In Planning',
  startDate: '',
  endDate: '',
  budget: 0,
  progress: 0,
  description: '',
  address: '',
  postalCode: '',
  city: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: ''
};

const projectTypes = [
  'Renovatie',
  'Dakkapel',
  'Aanbouw',
  'Kozijnen',
  'Vloeren',
  'Keuken',
  'Badkamer',
  'Anders'
];

const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProject, loading, error } = useAppSelector(
    (state) => state.projects
  );

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>(
    {}
  );

  useEffect(() => {
    if (id) {
      dispatch(getProject(id));
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProject) {
      setFormData({
        name: currentProject.name,
        client: currentProject.client,
        type: currentProject.type,
        status: currentProject.status,
        startDate: currentProject.startDate,
        endDate: currentProject.endDate,
        budget: currentProject.budget,
        progress: currentProject.progress,
        description: currentProject.description || '',
        address: currentProject.address || '',
        postalCode: currentProject.postalCode || '',
        city: currentProject.city || '',
        contactPerson: currentProject.contactPerson || '',
        contactEmail: currentProject.contactEmail || '',
        contactPhone: currentProject.contactPhone || ''
      });
    }
  }, [currentProject]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    switch (step) {
      case 0:
        if (!formData.name) newErrors.name = 'Project name is required';
        if (!formData.client) newErrors.client = 'Client name is required';
        if (!formData.type) newErrors.type = 'Project type is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        break;
      case 1:
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
        if (!formData.city) newErrors.city = 'City is required';
        break;
      case 2:
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
        if (!formData.contactEmail) {
          newErrors.contactEmail = 'Contact email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          newErrors.contactEmail = 'Invalid email format';
        }
        if (!formData.contactPhone) newErrors.contactPhone = 'Contact phone is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      try {
        if (id) {
          await dispatch(updateProject({ id, project: formData })).unwrap();
        } else {
          await dispatch(createProject(formData)).unwrap();
        }
        navigate('/projects');
      } catch (err) {
        // Error is handled by the projects slice
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof ProjectFormData]: value
    }));
    // Clear error when field is modified
    if (name && errors[name as keyof ProjectFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                error={!!errors.client}
                helperText={errors.client}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.type}>
                <InputLabel>Project Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Project Type"
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="In Planning">In Planning</MenuItem>
                  <MenuItem value="In Uitvoering">In Uitvoering</MenuItem>
                  <MenuItem value="Op Pause">Op Pause</MenuItem>
                  <MenuItem value="Voltooid">Voltooid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                error={!!errors.budget}
                helperText={errors.budget}
                required
                InputProps={{
                  startAdornment: '€'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                error={!!errors.postalCode}
                helperText={errors.postalCode}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                error={!!errors.contactPerson}
                helperText={errors.contactPerson}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                error={!!errors.contactEmail}
                helperText={errors.contactEmail}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                error={!!errors.contactPhone}
                helperText={errors.contactPhone}
                required
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Project' : 'New Project'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Project Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Location</StepLabel>
          </Step>
          <Step>
            <StepLabel>Contact</StepLabel>
          </Step>
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep < 2 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : id ? 'Update Project' : 'Create Project'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ProjectForm; 