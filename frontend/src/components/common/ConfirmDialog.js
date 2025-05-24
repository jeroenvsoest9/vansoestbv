import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { hideConfirmDialog } from "../../store/slices/uiSlice";

const ConfirmDialog = () => {
  const dispatch = useDispatch();
  const {
    open,
    title,
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
  } = useSelector((state) => state.ui.confirmDialog);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    dispatch(hideConfirmDialog());
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    dispatch(hideConfirmDialog());
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {cancelLabel || "Annuleren"}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          autoFocus
        >
          {confirmLabel || "Bevestigen"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
