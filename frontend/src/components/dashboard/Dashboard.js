import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContent: 0,
    publishedContent: 0,
    draftContent: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/content", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const content = response.data;
        setStats({
          totalContent: content.length,
          publishedContent: content.filter(
            (item) => item.status === "published",
          ).length,
          draftContent: content.filter((item) => item.status === "draft")
            .length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon }) => (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Icon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="p">
        {value}
      </Typography>
    </Paper>
  );

  const QuickAction = ({ title, description, icon: Icon, onClick }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Icon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick}>
          Start
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Totaal Content"
            value={stats.totalContent}
            icon={ArticleIcon}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Gepubliceerd"
            value={stats.publishedContent}
            icon={ArticleIcon}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Concepten"
            value={stats.draftContent}
            icon={ArticleIcon}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" component="h2" gutterBottom>
        Snelle Acties
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <QuickAction
            title="Nieuwe Content"
            description="Maak een nieuwe pagina of blog post"
            icon={AddIcon}
            onClick={() => navigate("/content/create")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <QuickAction
            title="AI Content Generator"
            description="Upload een foto en laat AI content genereren"
            icon={ImageIcon}
            onClick={() => navigate("/content/create?ai=true")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
