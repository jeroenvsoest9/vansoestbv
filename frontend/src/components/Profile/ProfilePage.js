const React = require('react');
const { useState } = require('react');
const { useDispatch, useSelector } = require('react-redux');
const { Formik, Form } = require('formik');
const * as Yup = require('yup');
const {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress
} = require('@mui/material');

// Import actions from auth slice
const { updateProfile, changePassword } = require('../../store/slices/authSlice');

// Validation schemas
const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Voornaam is verplicht')
    .min(2, 'Voornaam moet minimaal 2 karakters bevatten'),
  lastName: Yup.string()
    .required('Achternaam is verplicht')
    .min(2, 'Achternaam moet minimaal 2 karakters bevatten'),
  email: Yup.string()
    .email('Ongeldig e-mailadres')
    .required('E-mail is verplicht'),
  username: Yup.string()
    .required('Gebruikersnaam is verplicht')
    .min(3, 'Gebruikersnaam moet minimaal 3 karakters bevatten')
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Huidig wachtwoord is verplicht'),
  newPassword: Yup.string()
    .required('Nieuw wachtwoord is verplicht')
    .min(8, 'Wachtwoord moet minimaal 8 karakters bevatten')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Wachtwoord moet minimaal één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevatten'
    ),
  confirmPassword: Yup.string()
    .required('Bevestig wachtwoord is verplicht')
    .oneOf([Yup.ref('newPassword'), null], 'Wachtwoorden komen niet overeen')
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle profile update
  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateProfile(values)).unwrap();
      setSuccessMessage('Profiel succesvol bijgewerkt');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // Error is handled by the Redux slice
    } finally {
      setSubmitting(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      setSuccessMessage('Wachtwoord succesvol gewijzigd');
      resetForm();
      setOpenPasswordDialog(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      // Error is handled by the Redux slice
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mijn Profiel
      </Typography>

      {/* Success message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Profile Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Formik
            initialValues={{
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              username: user.username || ''
            }}
            validationSchema={profileSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="firstName"
                      label="Voornaam"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="lastName"
                      label="Achternaam"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      label="E-mail"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="username"
                      label="Gebruikersnaam"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting || loading}
                    >
                      {isSubmitting || loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Profiel Bijwerken'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Change Password Button */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpenPasswordDialog(true)}
      >
        Wachtwoord Wijzigen
      </Button>

      {/* Password Change Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Wachtwoord Wijzigen</DialogTitle>
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }}
          validationSchema={passwordSchema}
          onSubmit={handlePasswordSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      name="currentPassword"
                      label="Huidig Wachtwoord"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.currentPassword && Boolean(errors.currentPassword)}
                      helperText={touched.currentPassword && errors.currentPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      name="newPassword"
                      label="Nieuw Wachtwoord"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.newPassword && Boolean(errors.newPassword)}
                      helperText={touched.newPassword && errors.newPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      name="confirmPassword"
                      label="Bevestig Nieuw Wachtwoord"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenPasswordDialog(false)}
                  disabled={isSubmitting}
                >
                  Annuleren
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Wachtwoord Wijzigen'
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

module.exports = ProfilePage; 