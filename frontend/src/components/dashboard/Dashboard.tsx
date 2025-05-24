import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  LinearProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  Event as EventIcon,
  Photo as PhotoIcon,
  Message as MessageIcon,
  ExitToApp as LogoutIcon,
  TrendingUp,
  Assignment,
  AttachMoney,
  People,
  Warning,
  MoreVert,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Nieuws', icon: <ArticleIcon />, path: '/news' },
    { text: 'Evenementen', icon: <EventIcon />, path: '/events' },
    { text: "Foto's", icon: <PhotoIcon />, path: '/photos' },
    { text: 'Berichten', icon: <MessageIcon />, path: '/messages' },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Uitloggen" />
        </ListItem>
      </List>
    </div>
  );

  // Example data - in real app this would come from your state management
  const metrics = {
    activeProjects: 12,
    totalRevenue: '€ 1.250.000',
    pendingInvoices: 8,
    teamMembers: 15,
  };

  const recentProjects = [
    { id: 1, name: 'Renovatie Badkamer De Vries', status: 'In Uitvoering', progress: 65 },
    { id: 2, name: 'Dakkapel Einsteinlaan', status: 'In Uitvoering', progress: 30 },
    { id: 3, name: 'Aanbouw Keuken Jansen', status: 'In Uitvoering', progress: 85 },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Materiaal bestellen voor De Vries', dueDate: 'Vandaag', priority: 'high' },
    { id: 2, title: 'Vergunning aanvragen Einsteinlaan', dueDate: 'Morgen', priority: 'medium' },
    { id: 3, title: 'Factuur versturen Jansen', dueDate: 'Over 2 dagen', priority: 'low' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Van Soest CMS
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Actieve Projecten
              </Typography>
              <Typography variant="h3" component="div">
                {metrics.activeProjects}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                3 nieuwe deze maand
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: 'secondary.main',
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Totale Omzet
              </Typography>
              <Typography variant="h3" component="div">
                {metrics.totalRevenue}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                12% groei t.o.v. vorige maand
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: 'success.main',
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Openstaande Facturen
              </Typography>
              <Typography variant="h3" component="div">
                {metrics.pendingInvoices}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                € 45.000 totaal
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                bgcolor: 'info.main',
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Teamleden
              </Typography>
              <Typography variant="h3" component="div">
                {metrics.teamMembers}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                2 onderaannemers actief
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Projects and Tasks */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Actieve Projecten"
                action={
                  <IconButton aria-label="settings">
                    <MoreVert />
                  </IconButton>
                }
              />
              <CardContent>
                <List>
                  {recentProjects.map((project) => (
                    <ListItem key={project.id} divider>
                      <ListItemIcon>
                        <Assignment color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={project.name}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {project.status}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{ mt: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {project.progress}% voltooid
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Aankomende Taken"
                action={
                  <IconButton aria-label="settings">
                    <MoreVert />
                  </IconButton>
                }
              />
              <CardContent>
                <List>
                  {upcomingTasks.map((task) => (
                    <ListItem key={task.id} divider>
                      <ListItemIcon>
                        {task.priority === 'high' ? (
                          <Error color="error" />
                        ) : task.priority === 'medium' ? (
                          <Warning color="warning" />
                        ) : (
                          <CheckCircle color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Deadline: {task.dueDate}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 