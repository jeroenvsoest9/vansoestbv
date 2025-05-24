import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NotificationCenter from "../common/NotificationCenter";
import DialogManager from "../common/DialogManager";
import ConfirmDialog from "../common/ConfirmDialog";

const Layout = () => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` },
          ml: { sm: sidebarOpen ? "240px" : 0 },
          transition: "margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          backgroundColor: (theme) => theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Box sx={{ height: 64 }} /> {/* Toolbar spacer */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>

      <NotificationCenter />
      <DialogManager />
      <ConfirmDialog />
    </Box>
  );
};

export default Layout;
