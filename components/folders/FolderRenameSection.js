// components/folders/FolderRenameSection.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const FolderRenameSection = ({ folderId, folderName, setFolderName }) => { // ✅ Receive folderId, folderName, setFolderName as props
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [editedFolderName, setEditedFolderName] = useState('');
  const [renameErrorMessage, setRenameErrorMessage] = useState('');

  // --- Rename Modal Handlers ---
  const handleRenameModalOpen = () => {
    setEditedFolderName(folderName);
    setOpenRenameModal(true);
    setRenameErrorMessage('');
  };

  const handleRenameModalClose = () => {
    setOpenRenameModal(false);
    setEditedFolderName('');
    setRenameErrorMessage('');
  };

  const handleFolderNameEditChange = (event) => {
    setEditedFolderName(event.target.value);
    setRenameErrorMessage('');
  };

  const handleSaveFolderName = async () => {
    if (!editedFolderName.trim()) {
      setRenameErrorMessage('Folder name cannot be empty.');
      return;
    }

    try {
      const response = await axios.put(`/api/v1/lsov/folder/${folderId}`, { // ✅ Use folderId prop
        id: folderId,
        name: editedFolderName,
      });

      if (response.status === 200) {
        console.log('Folder renamed successfully:', response.data.data);
        setFolderName(editedFolderName); // ✅ Use setFolderName prop to update in parent
        handleRenameModalClose();
      } else {
        console.error('Failed to rename folder:', response);
        setRenameErrorMessage('Failed to rename folder. Please try again.');
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
      setRenameErrorMessage('Error renaming folder. Please try again.');
    }
  };

  const modalStyle = { /* ... modalStyle (same as before) ... */
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
    <div>
      <IconButton aria-label="rename folder" onClick={handleRenameModalOpen}>
        <EditIcon />
      </IconButton>

      {/* Rename Modal */}
      <Modal
        open={openRenameModal}
        onClose={handleRenameModalClose}
        aria-labelledby="rename-folder-modal-title"
        aria-describedby="rename-folder-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="rename-folder-modal-title" variant="h6" component="h2">
            Rename Folder
          </Typography>
          {renameErrorMessage && (
            <Typography color="error" sx={{ mt: 1 }}>{renameErrorMessage}</Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="folder-name"
            label="New Folder Name"
            type="text"
            fullWidth
            variant="standard"
            value={editedFolderName}
            onChange={handleFolderNameEditChange}
            error={!!renameErrorMessage}
            helperText={renameErrorMessage}
            onClick={(event) => event.stopPropagation()} //{/* ✅ STOP EVENT PROPAGATION HERE */}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleRenameModalClose}>Cancel</Button>
            <Button onClick={handleSaveFolderName} variant="contained" sx={{ ml: 1 }}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default FolderRenameSection;