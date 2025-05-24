import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { Project } from "../../types/project";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateProject } from "../../store/slices/projectsSlice";

interface ProjectManagerProps {
  project: Project;
}

interface ManagerAction {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category:
    | "planning"
    | "finance"
    | "team"
    | "risk"
    | "quality"
    | "communication";
  status: "pending" | "in_progress" | "completed";
  createdAt: Date;
  dueDate?: Date;
}

type ActionStatus = ManagerAction["status"];

const ProjectManager: React.FC<ProjectManagerProps> = ({ project }) => {
  const dispatch = useAppDispatch();
  const [actions, setActions] = useState<ManagerAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<ManagerAction | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial analysis
    analyzeProject();
  }, [project]);

  const analyzeProject = async () => {
    setLoading(true);
    try {
      // Analyze project status and generate actions
      const newActions: ManagerAction[] = [];

      // Check project timeline
      if (project.endDate && new Date(project.endDate) < new Date()) {
        const timelineAction: ManagerAction = {
          id: "timeline-1",
          type: "warning",
          title: "Project Deadline Overschreden",
          description:
            "Het project heeft de geplande einddatum overschreden. Directe actie vereist.",
          priority: "high",
          category: "planning",
          status: "pending" as ActionStatus,
          createdAt: new Date(),
        };
        newActions.push(timelineAction);
      }

      // Check budget
      if (project.budget && project.costs && project.costs > project.budget) {
        const budgetAction: ManagerAction = {
          id: "budget-1",
          type: "error",
          title: "Budget Overschreden",
          description: "De projectkosten overschrijden het beschikbare budget.",
          priority: "high",
          category: "finance",
          status: "pending" as ActionStatus,
          createdAt: new Date(),
        };
        newActions.push(budgetAction);
      }

      // Check team composition
      if (!project.team || project.team.length === 0) {
        const teamAction: ManagerAction = {
          id: "team-1",
          type: "warning",
          title: "Team Niet Samengesteld",
          description: "Er zijn nog geen teamleden toegewezen aan het project.",
          priority: "medium",
          category: "team",
          status: "pending" as ActionStatus,
          createdAt: new Date(),
        };
        newActions.push(teamAction);
      }

      // Add more sophisticated analysis here...

      setActions(newActions);
    } catch (error) {
      console.error("Error analyzing project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: ManagerAction) => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleActionComplete = async () => {
    if (selectedAction) {
      // Update action status
      const updatedActions = actions.map((action) =>
        action.id === selectedAction.id
          ? { ...action, status: "completed" }
          : action,
      );
      setActions(updatedActions);

      // Update project if necessary
      if (
        selectedAction.category === "planning" ||
        selectedAction.category === "finance"
      ) {
        await dispatch(
          updateProject({
            id: project._id,
            data: {
              // Add relevant updates based on action
              lastUpdated: new Date().toISOString(),
            },
          }),
        );
      }

      setDialogOpen(false);
      setSelectedAction(null);
    }
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case "planning":
        return <TimelineIcon />;
      case "finance":
        return <MoneyIcon />;
      case "team":
        return <PeopleIcon />;
      case "risk":
        return <WarningIcon />;
      case "quality":
        return <CheckCircleIcon />;
      case "communication":
        return <DescriptionIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "success":
        return "success";
      default:
        return "info";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <BuildIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Project Manager Dashboard</Typography>
      </Box>

      <List>
        {actions.map((action) => (
          <ListItem
            key={action.id}
            onClick={() => handleActionClick(action)}
            sx={{
              mb: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
            }}
          >
            <ListItemIcon>{getActionIcon(action.category)}</ListItemIcon>
            <ListItemText
              primary={action.title}
              secondary={action.description}
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={action.priority}
                size="small"
                color={action.priority === "high" ? "error" : "default"}
              />
              <Chip
                label={action.status}
                size="small"
                color={action.status === "completed" ? "success" : "default"}
              />
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAction && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                {getActionIcon(selectedAction.category)}
                {selectedAction.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Alert
                severity={getActionColor(selectedAction.type)}
                sx={{ mb: 2 }}
              >
                {selectedAction.description}
              </Alert>
              <Typography variant="body2" color="textSecondary">
                Categorie: {selectedAction.category}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Prioriteit: {selectedAction.priority}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Status: {selectedAction.status}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Aangemaakt: {selectedAction.createdAt.toLocaleDateString()}
              </Typography>
              {selectedAction.dueDate && (
                <Typography variant="body2" color="textSecondary">
                  Deadline: {selectedAction.dueDate.toLocaleDateString()}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Sluiten</Button>
              {selectedAction.status !== "completed" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleActionComplete}
                >
                  Markeer als Afgerond
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
};

export default ProjectManager;
