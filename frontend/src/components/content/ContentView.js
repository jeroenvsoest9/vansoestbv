import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Alert,
    Chip,
    ImageList,
    ImageListItem
} from '@mui/material';
import {
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import axios from 'axios';
import DOMPurify from 'dompurify';

const ContentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchContent();
    }, [id]);

    const fetchContent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/content/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setContent(response.data);
        } catch (err) {
            setError('Fout bij het ophalen van content');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'post':
                return 'Blog Post';
            case 'page':
                return 'Pagina';
            case 'menu':
                return 'Menu Item';
            default:
                return type;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!content) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                Content niet gevonden
            </Alert>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/content')}
                >
                    Terug naar overzicht
                </Button>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/content/${id}/edit`)}
                >
                    Bewerken
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {content.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                            label={getTypeLabel(content.type)}
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            label={content.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                            color={getStatusColor(content.status)}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Laatst bijgewerkt: {new Date(content.updatedAt).toLocaleString('nl-NL')}
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Content
                    </Typography>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(content.content)
                        }}
                    />
                </Box>

                {content.images && content.images.length > 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Afbeeldingen
                        </Typography>
                        <ImageList cols={3} gap={8}>
                            {content.images.map((image) => (
                                <ImageListItem key={image._id}>
                                    <img
                                        src={`http://localhost:5000${image.url}`}
                                        alt={`Content image ${image._id}`}
                                        loading="lazy"
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>
                )}
            </Paper>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Metadata
                        </Typography>
                        <Typography variant="body2">
                            ID: {content._id}
                        </Typography>
                        <Typography variant="body2">
                            Aangemaakt: {new Date(content.createdAt).toLocaleString('nl-NL')}
                        </Typography>
                        <Typography variant="body2">
                            Auteur: {content.author?.username || 'Onbekend'}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ContentView; 