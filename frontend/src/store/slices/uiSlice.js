import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarOpen: true,
    darkMode: false,
    notifications: [],
    currentDialog: null,
    dialogProps: null,
    confirmDialog: {
      open: false,
      title: "",
      message: "",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      onConfirm: null,
      onCancel: null,
    },
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        (notification) => notification.id === action.payload,
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openDialog: (state, action) => {
      state.currentDialog = action.payload.dialog;
      state.dialogProps = action.payload.props;
    },
    closeDialog: (state) => {
      state.currentDialog = null;
      state.dialogProps = null;
    },
    showConfirmDialog: (state, action) => {
      state.confirmDialog = {
        ...state.confirmDialog,
        open: true,
        ...action.payload,
      };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog = {
        ...state.confirmDialog,
        open: false,
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setDarkMode,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearNotifications,
  openDialog,
  closeDialog,
  showConfirmDialog,
  hideConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;
