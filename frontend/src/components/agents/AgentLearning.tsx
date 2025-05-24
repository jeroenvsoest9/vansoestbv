import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { Agent, AgentType } from '../../types/agents';
import { LearningSession, AgentCollaboration, AgentKnowledge, KnowledgeBase } from '../../types/agent-knowledge';

interface AgentLearningProps {
  agents: Agent[];
  onSessionCreate: (session: LearningSession) => void;
  onCollaborationCreate: (collaboration: AgentCollaboration) => void;
  onKnowledgeShare: (knowledge: AgentKnowledge) => void;
}

const AgentLearning: React.FC<AgentLearningProps> = ({
  agents,
  onSessionCreate,
  onCollaborationCreate,
  onKnowledgeShare
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [collaborations, setCollaborations] = useState<AgentCollaboration[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'session' | 'collaboration' | 'knowledge'>('session');
  const [selectedItem, setSelectedItem] = useState<LearningSession | AgentCollaboration | AgentKnowledge | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreate = (type: 'session' | 'collaboration' | 'knowledge') => {
    setDialogType(type);
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: LearningSession | AgentCollaboration | AgentKnowledge) => {
    setSelectedItem(item);
    setDialogType(
      'learningSessions' in item ? 'session' :
      'collaborations' in item ? 'collaboration' : 'knowledge'
    );
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 0) {
      setSessions(sessions.filter(s => s.id !== id));
    } else if (activeTab === 1) {
      setCollaborations(collaborations.filter(c => c.id !== id));
    } else {
      setKnowledgeBase(knowledgeBase.filter(k => k.id !== id));
    }
  };

  const handleSave = (data: any) => {
    if (dialogType === 'session') {
      const session = data as LearningSession;
      if (selectedItem) {
        setSessions(sessions.map(s => s.id === session.id ? session : s));
      } else {
        setSessions([...sessions, session]);
        onSessionCreate(session);
      }
    } else if (dialogType === 'collaboration') {
      const collaboration = data as AgentCollaboration;
      if (selectedItem) {
        setCollaborations(collaborations.map(c => c.id === collaboration.id ? collaboration : c));
      } else {
        setCollaborations([...collaborations, collaboration]);
        onCollaborationCreate(collaboration);
      }
    } else {
      const knowledge = data as AgentKnowledge;
      if (selectedItem) {
        setKnowledgeBase(knowledgeBase.map(k => k.id === knowledge.id ? knowledge : k));
      } else {
        const newKnowledge: KnowledgeBase = {
          id: Date.now().toString(),
          title: knowledge.title,
          description: knowledge.description,
          category: knowledge.category,
          content: knowledge.description,
          createdBy: knowledge.agentId,
          contributors: [],
          lastUpdated: new Date(),
          version: 1,
          tags: knowledge.tags,
          relatedKnowledge: [],
          usage: { views: 0, shares: 0, applications: 0 }
        };
        setKnowledgeBase([...knowledgeBase, newKnowledge]);
        onKnowledgeShare(knowledge);
      }
    }
    setDialogOpen(false);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Agent Learning & Collaboration
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => handleCreate(
            activeTab === 0 ? 'session' :
            activeTab === 1 ? 'collaboration' : 'knowledge'
          )}
        >
          Create New
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<SchoolIcon />} label="Learning Sessions" />
          <Tab icon={<GroupIcon />} label="Collaborations" />
          <Tab icon={<BookIcon />} label="Knowledge Base" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <List>
          {sessions.map(session => (
            <ListItem key={session.id}>
              <ListItemText
                primary={session.title}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(session.date).toLocaleDateString()} - {session.duration} minutes
                    </Typography>
                    <Typography variant="body2">
                      {session.description}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      {session.topics.map(topic => (
                        <Chip key={topic} label={topic} size="small" />
                      ))}
                    </Box>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(session)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(session.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {activeTab === 1 && (
        <List>
          {collaborations.map(collaboration => (
            <ListItem key={collaboration.id}>
              <ListItemText
                primary={collaboration.purpose}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(collaboration.date).toLocaleDateString()} - {collaboration.duration} minutes
                    </Typography>
                    <Typography variant="body2">
                      Type: {collaboration.type}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      {collaboration.outcomes.decisions.map(decision => (
                        <Chip key={decision} label={decision} size="small" />
                      ))}
                    </Box>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(collaboration)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(collaboration.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {activeTab === 2 && (
        <List>
          {knowledgeBase.map(knowledge => (
            <ListItem key={knowledge.id}>
              <ListItemText
                primary={knowledge.title}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Category: {knowledge.category}
                    </Typography>
                    <Typography variant="body2">
                      {knowledge.description}
                    </Typography>
                    <Box display="flex" gap={1} mt={1}>
                      {knowledge.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEdit(knowledge)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(knowledge.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? 'Edit' : 'Create'} {
            dialogType === 'session' ? 'Learning Session' :
            dialogType === 'collaboration' ? 'Collaboration' : 'Knowledge'
          }
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            {dialogType === 'session' && (
              <>
                <TextField
                  label="Title"
                  fullWidth
                  defaultValue={selectedItem?.title}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  defaultValue={selectedItem?.description}
                />
                <FormControl fullWidth>
                  <InputLabel>Organizer</InputLabel>
                  <Select
                    label="Organizer"
                    defaultValue={selectedItem?.organizer}
                  >
                    {agents.map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Participants</InputLabel>
                  <Select
                    multiple
                    label="Participants"
                    defaultValue={selectedItem?.participants}
                    renderValue={(selected) => (
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={agents.find(a => a.id === value)?.name}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {agents.map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {dialogType === 'collaboration' && (
              <>
                <TextField
                  label="Purpose"
                  fullWidth
                  defaultValue={selectedItem?.purpose}
                />
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    defaultValue={selectedItem?.type}
                  >
                    <MenuItem value="meeting">Meeting</MenuItem>
                    <MenuItem value="workshop">Workshop</MenuItem>
                    <MenuItem value="review">Review</MenuItem>
                    <MenuItem value="brainstorming">Brainstorming</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Participants</InputLabel>
                  <Select
                    multiple
                    label="Participants"
                    defaultValue={selectedItem?.agents}
                    renderValue={(selected) => (
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={agents.find(a => a.id === value)?.name}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {agents.map(agent => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {dialogType === 'knowledge' && (
              <>
                <TextField
                  label="Title"
                  fullWidth
                  defaultValue={selectedItem?.title}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  defaultValue={selectedItem?.description}
                />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    defaultValue={selectedItem?.category}
                  >
                    <MenuItem value="best_practice">Best Practice</MenuItem>
                    <MenuItem value="lesson_learned">Lesson Learned</MenuItem>
                    <MenuItem value="improvement">Improvement</MenuItem>
                    <MenuItem value="experience">Experience</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Tags"
                  fullWidth
                  defaultValue={selectedItem?.tags?.join(', ')}
                  helperText="Separate tags with commas"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSave({
              id: selectedItem?.id || Date.now().toString(),
              ...Object.fromEntries(
                new FormData(document.querySelector('form') as HTMLFormElement)
              )
            })}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentLearning; 