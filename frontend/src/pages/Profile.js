import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { updateProfile, changePassword } from "../store/slices/authSlice";

const profileValidationSchema = Yup.object({
  firstName: Yup.string().required("Voornaam is verplicht"),
  lastName: Yup.string().required("Achternaam is verplicht"),
  email: Yup.string()
    .email("Voer een geldig e-mailadres in")
    .required("E-mailadres is verplicht"),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Huidig wachtwoord is verplicht"),
  newPassword: Yup.string()
    .min(8, "Wachtwoord moet minimaal 8 karakters bevatten")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Wachtwoord moet minimaal één hoofdletter, één kleine letter, één cijfer en één speciaal teken bevatten",
    )
    .required("Nieuw wachtwoord is verplicht"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Wachtwoorden komen niet overeen")
    .required("Bevestig je nieuwe wachtwoord"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { user, error, isLoading } = useSelector((state) => state.auth);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

  const profileFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(updateProfile(values));
      if (!resultAction.error) {
        setProfileUpdateSuccess(true);
        setTimeout(() => setProfileUpdateSuccess(false), 3000);
      }
    },
    enableReinitialize: true,
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      );
      if (!resultAction.error) {
        setPasswordChangeSuccess(true);
        setShowPasswordDialog(false);
        passwordFormik.resetForm();
      }
    },
  });

  const handleClosePasswordDialog = () => {
    setShowPasswordDialog(false);
    passwordFormik.resetForm();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Profiel
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {profileUpdateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profiel succesvol bijgewerkt
          </Alert>
        )}

        {passwordChangeSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Wachtwoord succesvol gewijzigd
          </Alert>
        )}

        <Box component="form" onSubmit={profileFormik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Voornaam"
                value={profileFormik.values.firstName}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                error={
                  profileFormik.touched.firstName &&
                  Boolean(profileFormik.errors.firstName)
                }
                helperText={
                  profileFormik.touched.firstName &&
                  profileFormik.errors.firstName
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Achternaam"
                value={profileFormik.values.lastName}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                error={
                  profileFormik.touched.lastName &&
                  Boolean(profileFormik.errors.lastName)
                }
                helperText={
                  profileFormik.touched.lastName &&
                  profileFormik.errors.lastName
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="E-mailadres"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                error={
                  profileFormik.touched.email &&
                  Boolean(profileFormik.errors.email)
                }
                helperText={
                  profileFormik.touched.email && profileFormik.errors.email
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Bezig met opslaan..." : "Wijzigingen opslaan"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowPasswordDialog(true)}
            >
              Wachtwoord wijzigen
            </Button>
          </Box>
        </Box>

        <Dialog open={showPasswordDialog} onClose={handleClosePasswordDialog}>
          <DialogTitle>Wachtwoord wijzigen</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              onSubmit={passwordFormik.handleSubmit}
              sx={{ pt: 2 }}
            >
              <TextField
                fullWidth
                margin="normal"
                id="currentPassword"
                name="currentPassword"
                label="Huidig wachtwoord"
                type="password"
                value={passwordFormik.values.currentPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.currentPassword &&
                  Boolean(passwordFormik.errors.currentPassword)
                }
                helperText={
                  passwordFormik.touched.currentPassword &&
                  passwordFormik.errors.currentPassword
                }
              />
              <TextField
                fullWidth
                margin="normal"
                id="newPassword"
                name="newPassword"
                label="Nieuw wachtwoord"
                type="password"
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.newPassword &&
                  Boolean(passwordFormik.errors.newPassword)
                }
                helperText={
                  passwordFormik.touched.newPassword &&
                  passwordFormik.errors.newPassword
                }
              />
              <TextField
                fullWidth
                margin="normal"
                id="confirmNewPassword"
                name="confirmNewPassword"
                label="Bevestig nieuw wachtwoord"
                type="password"
                value={passwordFormik.values.confirmNewPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                error={
                  passwordFormik.touched.confirmNewPassword &&
                  Boolean(passwordFormik.errors.confirmNewPassword)
                }
                helperText={
                  passwordFormik.touched.confirmNewPassword &&
                  passwordFormik.errors.confirmNewPassword
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePasswordDialog}>Annuleren</Button>
            <Button onClick={passwordFormik.handleSubmit} disabled={isLoading}>
              {isLoading ? "Bezig met wijzigen..." : "Wachtwoord wijzigen"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default Profile;
