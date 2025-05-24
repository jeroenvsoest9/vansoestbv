import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@mui/material';
import { closeDialog } from '../../store/slices/uiSlice';

// Import your dialog components here
import ProjectDialog from '../dialogs/ProjectDialog';
import InvoiceDialog from '../dialogs/InvoiceDialog';
import UserDialog from '../dialogs/UserDialog';

const DIALOG_COMPONENTS = {
  'project': ProjectDialog,
  'invoice': InvoiceDialog,
  'user': UserDialog,
};

const DialogManager = () => {
  const dispatch = useDispatch();
  const { currentDialog, dialogProps } = useSelector((state) => state.ui);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  if (!currentDialog) {
    return null;
  }

  const DialogComponent = DIALOG_COMPONENTS[currentDialog];

  if (!DialogComponent) {
    console.warn(`No dialog component found for type: ${currentDialog}`);
    return null;
  }

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogComponent {...dialogProps} onClose={handleClose} />
    </Dialog>
  );
};

export default DialogManager; 