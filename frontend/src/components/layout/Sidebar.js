import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as ProjectsIcon,
  Receipt as InvoicesIcon,
  Person as ClientsIcon,
  Assignment as TasksIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Projecten', icon: <ProjectsIcon />, path: '/projects' },
  { text: 'Facturen', icon: <InvoicesIcon />, path: '/invoices' },
  { text: 'Klanten', icon: <ClientsIcon />, path: '/clients' },
  { text: 'Taken', icon: <TasksIcon />, path: '/tasks' },
  { text: 'Rapporten', icon: <ReportsIcon />, path: '/reports' }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          transform: sidebarOpen ? 'none' : 'translateX(-240px)',
          visibility: sidebarOpen ? 'visible' : 'hidden',
          transition: 'transform 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, visibility 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
        },
      }}
    >
      <Box sx={{ height: 64 }} /> {/* Toolbar spacer */}
      
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="textSecondary">
          HOOFDMENU
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'inherit',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color: location.pathname === item.path ? 'inherit' : 'primary.main',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="textSecondary">
          SYSTEEM
        </Typography>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
            sx={{
              minHeight: 48,
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'inherit',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: 'center',
                color: location.pathname === '/settings' ? 'inherit' : 'primary.main',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Instellingen"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: location.pathname === '/settings' ? 600 : 400,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 