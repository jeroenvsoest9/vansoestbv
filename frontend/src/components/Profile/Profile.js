const React = require('react');
const { useState, useEffect } = require('react');
const { useDispatch, useSelector } = require('react-redux');
const { useFormik } = require('formik');
const Yup = require('yup');
const { updateProfile, changePassword } = require('../../store/slices/authSlice');
const { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Grid, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} = require('@mui/material');

// Validation schemas
const profileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required')
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const profileForm = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || ''
    },
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(updateProfile(values)).unwrap();
        setSuccessMessage('Profile updated successfully');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to update profile');
        setSuccessMessage('');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const passwordForm = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })).unwrap();
        setSuccessMessage('Password changed successfully');
        setErrorMessage('');
        resetForm();
        setShowPasswordDialog(false);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to change password');
        setSuccessMessage('');
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (user) {
      profileForm.setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || ''
      });
    }
  }, [user]);

  const handleClosePasswordDialog = () => {
    setShowPasswordDialog(false);
    passwordForm.resetForm();
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Profile Information</Typography>
          <form onSubmit={profileForm.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={profileForm.values.firstName}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.firstName && Boolean(profileForm.errors.firstName)}
                  helperText={profileForm.touched.firstName && profileForm.errors.firstName}
                  disabled={loading || profileForm.isSubmitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={profileForm.values.lastName}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.lastName && Boolean(profileForm.errors.lastName)}
                  helperText={profileForm.touched.lastName && profileForm.errors.lastName}
                  disabled={loading || profileForm.isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={profileForm.values.email}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.email && Boolean(profileForm.errors.email)}
                  helperText={profileForm.touched.email && profileForm.errors.email}
                  disabled={loading || profileForm.isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={profileForm.values.username}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.username && Boolean(profileForm.errors.username)}
                  helperText={profileForm.touched.username && profileForm.errors.username}
                  disabled={loading || profileForm.isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || profileForm.isSubmitting || !profileForm.dirty}
                  >
                    {(loading || profileForm.isSubmitting) ? (
                      <CircularProgress size={24} />
                    ) : 'Update Profile'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setShowPasswordDialog(true)}
                    disabled={loading || profileForm.isSubmitting}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={showPasswordDialog}
        onClose={handleClosePasswordDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={passwordForm.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  label="Current Password"
                  value={passwordForm.values.currentPassword}
                  onChange={passwordForm.handleChange}
                  onBlur={passwordForm.handleBlur}
                  error={passwordForm.touched.currentPassword && Boolean(passwordForm.errors.currentPassword)}
                  helperText={passwordForm.touched.currentPassword && passwordForm.errors.currentPassword}
                  disabled={loading || passwordForm.isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  value={passwordForm.values.newPassword}
                  onChange={passwordForm.handleChange}
                  onBlur={passwordForm.handleBlur}
                  error={passwordForm.touched.newPassword && Boolean(passwordForm.errors.newPassword)}
                  helperText={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
                  disabled={loading || passwordForm.isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={passwordForm.values.confirmPassword}
                  onChange={passwordForm.handleChange}
                  onBlur={passwordForm.handleBlur}
                  error={passwordForm.touched.confirmPassword && Boolean(passwordForm.errors.confirmPassword)}
                  helperText={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword}
                  disabled={loading || passwordForm.isSubmitting}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleClosePasswordDialog}
              disabled={loading || passwordForm.isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading || passwordForm.isSubmitting || !passwordForm.dirty || !passwordForm.isValid}
            >
              {(loading || passwordForm.isSubmitting) ? (
                <CircularProgress size={24} />
              ) : 'Change Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

module.exports = Profile; 