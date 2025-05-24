import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Project } from "../../types/project";

interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "error";
  isAutomated: boolean;
  dependencies: string[];
  estimatedDuration: string;
  actualDuration?: string;
  lastUpdated?: Date;
}

interface ProjectWorkflowProps {
  project: Project;
}

const ProjectWorkflow: React.FC<ProjectWorkflowProps> = ({ project }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: "initiation",
      label: "Project Initiatie",
      description: "Automatische opzet van projectomgeving en documentatie",
      status: "pending",
      isAutomated: true,
      dependencies: [],
      estimatedDuration: "1 dag",
    },
    {
      id: "planning",
      label: "Project Planning",
      description:
        "Opstellen van gedetailleerde planning en resource allocatie",
      status: "pending",
      isAutomated: true,
      dependencies: ["initiation"],
      estimatedDuration: "2-3 dagen",
    },
    {
      id: "team_setup",
      label: "Team Samenstelling",
      description: "Selectie en toewijzing van teamleden",
      status: "pending",
      isAutomated: true,
      dependencies: ["planning"],
      estimatedDuration: "1-2 dagen",
    },
    {
      id: "resource_allocation",
      label: "Resource Planning",
      description: "Toewijzing van materialen en apparatuur",
      status: "pending",
      isAutomated: true,
      dependencies: ["team_setup"],
      estimatedDuration: "2-3 dagen",
    },
    {
      id: "risk_assessment",
      label: "Risico Analyse",
      description: "Identificatie en mitigatie van projectrisico's",
      status: "pending",
      isAutomated: true,
      dependencies: ["resource_allocation"],
      estimatedDuration: "1-2 dagen",
    },
    {
      id: "budget_approval",
      label: "Budget Goedkeuring",
      description: "Financiële validatie en goedkeuring",
      status: "pending",
      isAutomated: false,
      dependencies: ["risk_assessment"],
      estimatedDuration: "2-3 dagen",
    },
  ]);

  const handleStepComplete = (stepId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status: "completed",
            lastUpdated: new Date(),
          };
        }
        return step;
      }),
    );
  };

  const handleStepError = (stepId: string) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status: "error",
            lastUpdated: new Date(),
          };
        }
        return step;
      }),
    );
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "in_progress":
        return <CircularProgress size={24} />;
      default:
        return <InfoIcon color="disabled" />;
    }
  };

  const getStepStatusChip = (step: WorkflowStep) => {
    const statusColors = {
      completed: "success",
      error: "error",
      in_progress: "primary",
      pending: "default",
    };

    return (
      <Chip
        icon={getStepIcon(step.status)}
        label={step.status.charAt(0).toUpperCase() + step.status.slice(1)}
        color={statusColors[step.status] as any}
        size="small"
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Project Workflow</Typography>
        <Tooltip title="Ververs Workflow Status">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Stepper orientation="vertical">
        {steps.map((step, index) => (
          <Step
            key={step.id}
            active={step.status === "in_progress"}
            completed={step.status === "completed"}
          >
            <StepLabel>
              <Box display="flex" alignItems="center">
                {step.label}
                {getStepStatusChip(step)}
                {step.isAutomated && (
                  <Chip
                    label="Geautomatiseerd"
                    size="small"
                    color="info"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="textSecondary" paragraph>
                {step.description}
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <Typography variant="caption" color="textSecondary">
                  Geschatte duur: {step.estimatedDuration}
                </Typography>
                {step.actualDuration && (
                  <Typography variant="caption" color="textSecondary">
                    | Werkelijke duur: {step.actualDuration}
                  </Typography>
                )}
              </Box>
              {step.dependencies.length > 0 && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                >
                  Afhankelijk van: {step.dependencies.join(", ")}
                </Typography>
              )}
              {step.status === "error" && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Er is een fout opgetreden bij deze stap. Probeer het opnieuw.
                </Alert>
              )}
              {step.status === "pending" && !step.isAutomated && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStepComplete(step.id)}
                  >
                    Voltooien
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default ProjectWorkflow;
