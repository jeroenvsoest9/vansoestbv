import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import nlLocale from 'date-fns/locale/nl';

interface Task {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  dependencies: number[];
}

interface Resource {
  id: number;
  name: string;
  role: string;
  availability: number;
  currentTasks: number[];
}

const ProjectPlanning: React.FC = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: 'Sloopwerk',
      description: 'Verwijderen van bestaande constructies',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-01'),
      status: 'completed',
      assignedTo: 'Mark de Boer',
      dependencies: [],
    },
    {
      id: 2,
      name: 'Elektra en sanitair',
      description: 'Installatie van nieuwe elektrische en sanitaire systemen',
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-03-15'),
      status: 'in-progress',
      assignedTo: 'Peter Jansen',
      dependencies: [1],
    },
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      name: 'Peter Jansen',
      role: 'Projectleider',
      availability: 100,
      currentTasks: [2],
    },
    {
      id: 2,
      name: 'Mark de Boer',
      role: 'Aannemer',
      availability: 75,
      currentTasks: [1],
    },
  ]);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'pending',
    assignedTo: '',
    dependencies: [],
  });

  const handleOpenTaskDialog = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
      setNewTask(task);
    } else {
      setSelectedTask(null);
      setNewTask({
        name: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        status: 'pending',
        assignedTo: '',
        dependencies: [],
      });
    }
    setOpenTaskDialog(true);
  };

  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setSelectedTask(null);
  };

  const handleSaveTask = () => {
    if (selectedTask) {
      setTasks(tasks.map(task =>
        task.id === selectedTask.id ? { ...task, ...newTask } : task
      ));
    } else {
      setTasks([...tasks, { ...newTask, id: tasks.length + 1 } as Task]);
    }
    handleCloseTaskDialog();
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Project Planning</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenTaskDialog()}
        >
          Taak Toevoegen
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Project Timeline
            </Typography>
            <List>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenTaskDialog(task)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {task.name}
                          <Chip
                            label={task.status}
                            color={getStatusColor(task.status) as any}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          {task.description}
                          <br />
                          {`${task.startDate.toLocaleDateString('nl-NL')} - ${task.endDate.toLocaleDateString('nl-NL')}`}
                          <br />
                          {`Toegewezen aan: ${task.assignedTo}`}
                        </>
                      }
                    />
                  </ListItem>
                  {index < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Beschikbare Resources
            </Typography>
            <List>
              {resources.map((resource) => (
                <ListItem key={resource.id}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={resource.name}
                    secondary={
                      <>
                        {resource.role}
                        <br />
                        {`Beschikbaarheid: ${resource.availability}%`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Taak Bewerken' : 'Nieuwe Taak'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Taaknaam"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Beschrijving"
                  multiline
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nlLocale}>
                  <DatePicker
                    label="Start Datum"
                    value={newTask.startDate}
                    onChange={(date) => setNewTask({ ...newTask, startDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nlLocale}>
                  <DatePicker
                    label="Eind Datum"
                    value={newTask.endDate}
                    onChange={(date) => setNewTask({ ...newTask, endDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newTask.status}
                    label="Status"
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Toegewezen aan</InputLabel>
                  <Select
                    value={newTask.assignedTo}
                    label="Toegewezen aan"
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    {resources.map((resource) => (
                      <MenuItem key={resource.id} value={resource.name}>
                        {resource.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>Annuleren</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {selectedTask ? 'Bijwerken' : 'Toevoegen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectPlanning; 