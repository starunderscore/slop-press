// components/folders/FolderModal.js
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const FolderModal = ({
  openModal,
  handleModalClose,
  newFolderName,
  handleFolderNameChange,
  handleCreateFolder,
  errorMessage,
  modalTitle = "Create New Folder", // ✅ Default modal title
  modalDescriptionId = "new-folder-modal-description", // ✅ Default description ID
  modalTitleId = "new-folder-modal-title", // ✅ Default title ID
}) => {
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={openModal}
      onClose={handleModalClose}
      aria-labelledby={modalTitleId}       // ✅ Use modalTitleId prop
      aria-describedby={modalDescriptionId} // ✅ Use modalDescriptionId prop
    >
      <Box sx={modalStyle}>
        <Typography id={modalTitleId} variant="h6" component="h2"> {/* ✅ Use modalTitleId prop */}
          {modalTitle} {/* ✅ Use modalTitle prop */}
        </Typography>
        {errorMessage && ( // Display error message here, inside the modal
          <Typography color="error" sx={{ mt: 1 }}>{errorMessage}</Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="folder-name"
          label="Folder Name"
          type="text"
          fullWidth
          variant="standard"
          value={newFolderName}
          onChange={handleFolderNameChange}
          error={!!errorMessage} // Set error state if errorMessage is not empty
          helperText={errorMessage} // Display errorMessage as helper text
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleCreateFolder} variant="contained" sx={{ ml: 1 }}>Create</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FolderModal;