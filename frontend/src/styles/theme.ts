import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A31621", // Van Soest Red
      light: "#c41e2b",
      dark: "#7a1018",
    },
    secondary: {
      main: "#1A2353", // Van Soest Blue
      light: "#2a3366",
      dark: "#131a3f",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#1A2353",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1A2353",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#1A2353",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#1A2353",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#1A2353",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#1A2353",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#666666",
    },
    body1: {
      fontSize: "1rem",
      color: "#333333",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1A2353",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default theme;
