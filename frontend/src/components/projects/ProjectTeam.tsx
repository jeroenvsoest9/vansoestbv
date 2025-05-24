import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Project, TeamMember, TeamMemberFormData } from "../../types/project";
import {
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
} from "../../store/slices/projectsSlice";
import { useAppDispatch } from "../../store/hooks";

interface ProjectTeamProps {
  project: Project;
}

const ROLES = [
  "Project Manager",
  "Architect",
  "Engineer",
  "Contractor",
  "Client",
  "Other",
];

const ProjectTeam: React.FC<ProjectTeamProps> = ({ project }) => {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: "",
    role: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        email: member.email,
      });
    } else {
      setSelectedMember(null);
      setFormData({
        name: "",
        role: "",
        email: "",
      });
    }
    setDialogOpen(true);
    setError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
    setFormData({
      name: "",
      role: "",
      email: "",
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.role || !formData.email) {
        setError("All fields are required");
        return;
      }

      if (selectedMember) {
        await dispatch(
          updateTeamMember({
            projectId: project._id,
            memberId: selectedMember.id,
            data: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addTeamMember({
            projectId: project._id,
            member: formData,
          }),
        ).unwrap();
      }

      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (memberId: string) => {
    try {
      await dispatch(
        removeTeamMember({
          projectId: project._id,
          memberId,
        }),
      ).unwrap();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Team Members</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Member
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <List>
          {project.team.map((member) => (
            <ListItem key={member.id}>
              <ListItemText
                primary={member.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {member.role}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                    >
                      {member.email}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenDialog(member)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(member.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMember ? "Edit Team Member" : "Add Team Member"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedMember ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectTeam;
