import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Save as SaveIcon,
    Image as ImageIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const ContentEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'post',
        status: 'draft'
    });
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

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

            const { title, content, type, status, images } = response.data;
            setFormData({ title, content, type, status });
            setExistingImages(images || []);
        } catch (err) {
            setError('Fout bij het ophalen van content');
            console.error('Fetch error:', err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            content: value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        
        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            file
        }));
        
        setPreviewImages(prev => [...prev, ...previews]);
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/content/${id}/images/${imageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setExistingImages(prev => 
                prev.filter(image => image._id !== imageId)
            );
        } catch (err) {
            setError('Fout bij het verwijderen van afbeelding');
            console.error('Delete image error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const submitFormData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                submitFormData.append(key, formData[key]);
            });

            // Append new images
            images.forEach(image => {
                submitFormData.append('images', image);
            });

            await axios.put(
                `http://localhost:5000/api/content/${id}`,
                submitFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            navigate('/content');
        } catch (err) {
            setError('Fout bij het opslaan van content');
            console.error('Save error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Content Bewerken
                </Typography>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                >
                    Opslaan
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Titel"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Content
                            </Typography>
                            <ReactQuill
                                value={formData.content}
                                onChange={handleContentChange}
                                style={{ height: '300px', marginBottom: '50px' }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                label="Type"
                            >
                                <MenuItem value="post">Blog Post</MenuItem>
                                <MenuItem value="page">Pagina</MenuItem>
                                <MenuItem value="menu">Menu Item</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                label="Status"
                            >
                                <MenuItem value="draft">Concept</MenuItem>
                                <MenuItem value="published">Gepubliceerd</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>

                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Afbeeldingen
                        </Typography>
                        
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            Upload Afbeeldingen
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                        </Button>

                        <Grid container spacing={1}>
                            {existingImages.map((image) => (
                                <Grid item xs={6} key={image._id}>
                                    <Box sx={{ position: 'relative' }}>
                                        <img
                                            src={`http://localhost:5000${image.url}`}
                                            alt={`Existing ${image._id}`}
                                            style={{
                                                width: '100%',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                            }}
                                            onClick={() => removeExistingImage(image._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                            {previewImages.map((image, index) => (
                                <Grid item xs={6} key={`new-${index}`}>
                                    <Box sx={{ position: 'relative' }}>
                                        <img
                                            src={image.url}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                            }}
                                            onClick={() => removeImage(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ContentEdit; 