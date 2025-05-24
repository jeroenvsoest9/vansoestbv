import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Paper,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const ContentList = () => {
    const navigate = useNavigate();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/content', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContent(response.data);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedContent) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/content/${selectedContent}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchContent();
            setDeleteDialogOpen(false);
            setSelectedContent(null);
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };

    const columns = [
        { field: 'title', headerName: 'Titel', flex: 1 },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 120,
            renderCell: (params) => (
                <Chip 
                    label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
                    color={params.value === 'page' ? 'primary' : 'secondary'}
                    variant="outlined"
                />
            )
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 130,
            renderCell: (params) => (
                <Chip 
                    label={params.value === 'published' ? 'Gepubliceerd' : 'Concept'} 
                    color={params.value === 'published' ? 'success' : 'default'}
                />
            )
        },
        {
            field: 'createdAt',
            headerName: 'Aangemaakt op',
            width: 180,
            valueFormatter: (params) => 
                format(new Date(params.value), 'dd MMMM yyyy HH:mm', { locale: nl })
        },
        {
            field: 'actions',
            headerName: 'Acties',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton 
                        size="small" 
                        onClick={() => navigate(`/content/edit/${params.row._id}`)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                            setSelectedContent(params.row._id);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Content Beheer
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/content/create')}
                >
                    Nieuwe Content
                </Button>
            </Box>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={content}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row._id}
                    loading={loading}
                    disableSelectionOnClick
                />
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Content Verwijderen</DialogTitle>
                <DialogContent>
                    Weet je zeker dat je deze content wilt verwijderen?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Annuleren
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Verwijderen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContentList; 