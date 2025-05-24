import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Link,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username.trim()) {
            newErrors.username = 'Gebruikersnaam is verplicht';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Gebruikersnaam moet minimaal 3 karakters bevatten';
        }
        if (!formData.password) {
            newErrors.password = 'Wachtwoord is verplicht';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Wachtwoord moet minimaal 6 karakters bevatten';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Bevestig je wachtwoord';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Wachtwoorden komen niet overeen';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const success = await register(formData.username, formData.password);
        setLoading(false);

        if (success) {
            navigate('/');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <Typography component="h1" variant="h5" gutterBottom>
                        Van Soest CMS
                    </Typography>
                    <Typography component="h2" variant="h6" gutterBottom>
                        Registreren
                    </Typography>

                    {authError && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {authError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Gebruikersnaam"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleInputChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Wachtwoord"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Bevestig wachtwoord"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Registreren'
                            )}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                component={RouterLink}
                                to="/login"
                                variant="body2"
                                underline="hover"
                            >
                                Al een account? Log hier in
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 