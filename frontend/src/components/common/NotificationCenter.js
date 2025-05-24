import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { removeNotification, markNotificationAsRead, clearNotifications } from '../../store/slices/uiSlice';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon color="success" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    default:
      return <InfoIcon color="info" />;
  }
};

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.ui);

  const handleClose = () => {
    // Close notification center logic here
  };

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  return (
    <Drawer
      anchor="right"
      open={false} // Control this with UI state
      onClose={handleClose}
    >
      <Box sx={{ width: 320, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Notificaties</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {notifications.length > 0 ? (
          <>
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    }}
                  >
                    <Box sx={{ mr: 2, mt: 1 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {new Date(notification.timestamp).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction>
                      {!notification.read && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ mr: 1 }}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearAll}
                size="small"
              >
                Alles wissen
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
              color: 'text.secondary',
            }}
          >
            <InfoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">Geen notificaties</Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationCenter; 