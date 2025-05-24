import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Message as MessageIcon,
  Description as DescriptionIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  VerifiedUser as VerifiedUserIcon,
  Computer as ComputerIcon,
  Calculate as CalculateIcon,
  Share as ShareIcon,
  Create as CreateIcon,
  Nature as NatureIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import {
  Agent,
  AgentSystem,
  AgentType,
  AGENT_CONFIGS,
} from "../../types/agents";
import {
  LearningSession,
  AgentCollaboration,
  AgentKnowledge,
} from "../../types/agent-knowledge";
import AgentLearning from "./AgentLearning";

const AgentSystem: React.FC = () => {
  const [system, setSystem] = useState<AgentSystem>({
    agents: [],
    actions: [],
    status: "healthy",
    lastHealthCheck: new Date(),
    metrics: {
      totalAgents: 0,
      activeAgents: 0,
      totalActions: 0,
      completedActions: 0,
      failedActions: 0,
      averageResponseTime: 0,
      systemUptime: 0,
    },
  });

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAgents();
    const interval = setInterval(checkSystemHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const initializeAgents = async () => {
    setLoading(true);
    try {
      // Initialize all agents based on configs
      const agents: Agent[] = Object.values(AGENT_CONFIGS).map((config) => ({
        id: `${config.type}-${Date.now()}`,
        name: config.name,
        type: config.type,
        status: "active",
        lastActive: new Date(),
        capabilities: config.capabilities,
        metrics: {
          tasksCompleted: 0,
          successRate: 100,
          averageResponseTime: 0,
        },
      }));

      setSystem((prev) => ({
        ...prev,
        agents,
        metrics: {
          ...prev.metrics,
          totalAgents: agents.length,
          activeAgents: agents.length,
        },
      }));

      // Start agent monitoring
      agents.forEach((agent) => startAgentMonitoring(agent));
    } catch (err) {
      setError("Failed to initialize agents");
      console.error("Error initializing agents:", err);
    } finally {
      setLoading(false);
    }
  };

  const startAgentMonitoring = (agent: Agent) => {
    const config = AGENT_CONFIGS[agent.type];
    setInterval(async () => {
      try {
        await performAgentCheck(agent);
      } catch (err) {
        console.error(`Error checking agent ${agent.name}:`, err);
        updateAgentStatus(agent.id, "error");
      }
    }, config.checkInterval);
  };

  const performAgentCheck = async (agent: Agent) => {
    // Simulate agent performing its duties
    const startTime = Date.now();
    try {
      // Agent-specific checks would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate work

      updateAgentMetrics(agent.id, {
        tasksCompleted: agent.metrics.tasksCompleted + 1,
        successRate: 100,
        averageResponseTime:
          (agent.metrics.averageResponseTime + (Date.now() - startTime)) / 2,
      });

      updateAgentStatus(agent.id, "active");
    } catch (err) {
      updateAgentStatus(agent.id, "error");
      throw err;
    }
  };

  const updateAgentStatus = (
    agentId: string,
    status: "active" | "inactive" | "error",
  ) => {
    setSystem((prev) => ({
      ...prev,
      agents: prev.agents.map((agent) =>
        agent.id === agentId
          ? { ...agent, status, lastActive: new Date() }
          : agent,
      ),
      metrics: {
        ...prev.metrics,
        activeAgents: prev.agents.filter((a) => a.status === "active").length,
      },
    }));
  };

  const updateAgentMetrics = (agentId: string, metrics: Agent["metrics"]) => {
    setSystem((prev) => ({
      ...prev,
      agents: prev.agents.map((agent) =>
        agent.id === agentId ? { ...agent, metrics } : agent,
      ),
    }));
  };

  const checkSystemHealth = () => {
    const now = new Date();
    const activeAgents = system.agents.filter(
      (a) => a.status === "active",
    ).length;
    const totalAgents = system.agents.length;

    let newStatus: "healthy" | "degraded" | "critical" = "healthy";
    if (activeAgents < totalAgents * 0.5) {
      newStatus = "critical";
    } else if (activeAgents < totalAgents) {
      newStatus = "degraded";
    }

    setSystem((prev) => ({
      ...prev,
      status: newStatus,
      lastHealthCheck: now,
      metrics: {
        ...prev.metrics,
        activeAgents,
        systemUptime: (now.getTime() - prev.lastHealthCheck.getTime()) / 1000,
      },
    }));
  };

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case "project_manager":
        return <BuildIcon />;
      case "financial_controller":
        return <AssessmentIcon />;
      case "quality_assurance":
        return <WarningIcon />;
      case "risk_manager":
        return <SecurityIcon />;
      case "team_coordinator":
        return <GroupIcon />;
      case "document_manager":
        return <DescriptionIcon />;
      case "communication_manager":
        return <MessageIcon />;
      case "system_maintainer":
        return <StorageIcon />;
      case "security_monitor":
        return <SecurityIcon />;
      case "performance_optimizer":
        return <SpeedIcon />;
      case "qaa_agent":
        return <VerifiedUserIcon />;
      case "ict_manager":
        return <ComputerIcon />;
      case "offerte_manager":
        return <DescriptionIcon />;
      case "calculatie_specialist":
        return <CalculateIcon />;
      case "social_media_manager":
        return <ShareIcon />;
      case "content_creator":
        return <CreateIcon />;
      case "maintenance_coordinator":
        return <BuildIcon />;
      case "safety_officer":
        return <SecurityIcon />;
      case "environmental_manager":
        return <NatureIcon />;
      case "procurement_specialist":
        return <ShoppingCartIcon />;
      default:
        return <BuildIcon />;
    }
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setDialogOpen(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    initializeAgents().finally(() => setLoading(false));
  };

  const handleSessionCreate = (session: LearningSession) => {
    // Notify relevant agents about the new learning session
    const relevantAgents = system.agents.filter(
      (agent) =>
        session.participants.includes(agent.id) ||
        session.topics.some((topic) =>
          agent.capabilities.some((cap) => cap.includes(topic)),
        ),
    );

    relevantAgents.forEach((agent) => {
      console.log(
        `Notifying ${agent.name} about new learning session: ${session.title}`,
      );
      // Here you would implement actual notification logic
    });
  };

  const handleCollaborationCreate = (collaboration: AgentCollaboration) => {
    // Notify participating agents about the new collaboration
    const participatingAgents = system.agents.filter((agent) =>
      collaboration.agents.includes(agent.id),
    );

    participatingAgents.forEach((agent) => {
      console.log(
        `Notifying ${agent.name} about new collaboration: ${collaboration.purpose}`,
      );
      // Here you would implement actual notification logic
    });
  };

  const handleKnowledgeShare = (knowledge: AgentKnowledge) => {
    // Share knowledge with relevant agents
    const relevantAgents = system.agents.filter((agent) =>
      knowledge.tags.some((tag) =>
        agent.capabilities.some((cap) => cap.includes(tag)),
      ),
    );

    relevantAgents.forEach((agent) => {
      console.log(`Sharing knowledge with ${agent.name}: ${knowledge.title}`);
      // Here you would implement actual knowledge sharing logic
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Agent System Dashboard</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="contained"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Status: {system.status}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box flex="1" minWidth="200px">
            <Typography variant="body2" color="textSecondary">
              Total Agents
            </Typography>
            <Typography variant="h4">{system.metrics.totalAgents}</Typography>
          </Box>
          <Box flex="1" minWidth="200px">
            <Typography variant="body2" color="textSecondary">
              Active Agents
            </Typography>
            <Typography variant="h4">{system.metrics.activeAgents}</Typography>
          </Box>
          <Box flex="1" minWidth="200px">
            <Typography variant="body2" color="textSecondary">
              System Uptime
            </Typography>
            <Typography variant="h4">
              {Math.floor(system.metrics.systemUptime / 3600)}h
            </Typography>
          </Box>
          <Box flex="1" minWidth="200px">
            <Typography variant="body2" color="textSecondary">
              Last Health Check
            </Typography>
            <Typography variant="h4">
              {system.lastHealthCheck.toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {system.agents.map((agent) => (
          <Box key={agent.id} flex="1" minWidth="300px" maxWidth="400px">
            <Card
              sx={{
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleAgentClick(agent)}
            >
              <CardHeader
                avatar={getAgentIcon(agent.type)}
                title={agent.name}
                subheader={agent.type}
                action={
                  <Chip
                    label={agent.status}
                    color={
                      agent.status === "active"
                        ? "success"
                        : agent.status === "error"
                          ? "error"
                          : "default"
                    }
                    size="small"
                  />
                }
              />
              <CardContent>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Tasks Completed
                  </Typography>
                  <Typography variant="h6">
                    {agent.metrics.tasksCompleted}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    Success Rate
                  </Typography>
                  <Typography variant="h6">
                    {agent.metrics.successRate}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Avg Response Time
                  </Typography>
                  <Typography variant="h6">
                    {agent.metrics.averageResponseTime.toFixed(2)}ms
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box mt={4}>
        <AgentLearning
          agents={system.agents}
          onSessionCreate={handleSessionCreate}
          onCollaborationCreate={handleCollaborationCreate}
          onKnowledgeShare={handleKnowledgeShare}
        />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedAgent && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={1}>
                {getAgentIcon(selectedAgent.type)}
                {selectedAgent.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Capabilities
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedAgent.capabilities.map((capability) => (
                      <Chip key={capability} label={capability} size="small" />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Metrics
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    <Box flex="1" minWidth="200px">
                      <Typography variant="body2" color="textSecondary">
                        Tasks Completed
                      </Typography>
                      <Typography variant="h6">
                        {selectedAgent.metrics.tasksCompleted}
                      </Typography>
                    </Box>
                    <Box flex="1" minWidth="200px">
                      <Typography variant="body2" color="textSecondary">
                        Success Rate
                      </Typography>
                      <Typography variant="h6">
                        {selectedAgent.metrics.successRate}%
                      </Typography>
                    </Box>
                    <Box flex="1" minWidth="200px">
                      <Typography variant="body2" color="textSecondary">
                        Avg Response Time
                      </Typography>
                      <Typography variant="h6">
                        {selectedAgent.metrics.averageResponseTime.toFixed(2)}ms
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {selectedAgent.metrics.lastError && (
                  <Box>
                    <Alert severity="error">
                      Last Error: {selectedAgent.metrics.lastError}
                    </Alert>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AgentSystem;
