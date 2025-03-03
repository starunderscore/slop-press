// components/folders/FolderActionsMenu.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Three-dot menu icon
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useRouter } from 'next/router';
import FolderModal from './FolderModal';

const FolderActionsMenu = ({ folderId, folderName, setFolderName, onFolderContentsUpdated }) => { // ✅ Receive folderId, folderName, setFolderName as props
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // --- Menu Handlers ---
  const handleMenuOpen = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // --- New Folder Modal State and Handlers ---
  const [openNewFolderModal, setOpenNewFolderModal] = useState(false); // ✅ State for New Folder modal
  const [newSubfolderName, setNewSubfolderName] = useState('');         // ✅ State for new subfolder name input
  const [newFolderErrorMessage, setNewFolderErrorMessage] = useState(''); // ✅ State for new folder error message

  const handleNewFolderModalOpen = () => {
    setOpenNewFolderModal(true);
    setNewFolderErrorMessage(''); // Clear any previous errors
    handleMenuClose(); // Close the actions menu when New Folder modal opens
  };

  const handleNewFolderModalClose = () => {
    setOpenNewFolderModal(false);
    setNewSubfolderName('');
    setNewFolderErrorMessage('');
  };

  const handleNewSubfolderNameChange = (event) => {
    setNewSubfolderName(event.target.value);
    setNewFolderErrorMessage('');
  };

  const handleCreateSubfolder = async () => {
    if (!newSubfolderName.trim()) {
      setNewFolderErrorMessage('Folder name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/lsov/folder', { // ✅ POST to create new folder
        name: newSubfolderName,
        folderId: folderId, // ✅ IMPORTANT: Pass the current folderId to create a subfolder!
      });

      if (response.status === 201) {
        console.log('Subfolder created successfully:', response.data.data);
        handleNewFolderModalClose();
        console.log('Calling onFolderContentsUpdated from FolderActionsMenu'); // ✅ ADD THIS LINE
        onFolderContentsUpdated();
      } else {
        console.error('Failed to create subfolder:', response);
        setNewFolderErrorMessage('Failed to create subfolder. Please try again.');
      }
    } catch (error) {
      console.error('Error creating subfolder:', error);
      setNewFolderErrorMessage('Error creating subfolder. Please try again.');
    }
  };

  // --- Rename Modal State and Handlers (moved from FolderRenameSection) ---
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [editedFolderName, setEditedFolderName] = useState('');
  const [renameErrorMessage, setRenameErrorMessage] = useState('');

  const handleRenameModalOpen = () => {
    setEditedFolderName(folderName);
    setOpenRenameModal(true);
    setRenameErrorMessage('');
    handleMenuClose(); // Close the actions menu when Rename modal opens
  };

  const handleRenameModalClose = () => {
    setOpenRenameModal(false);
    setEditedFolderName('');
    setRenameErrorMessage('');
  };

  const handleFolderNameEditChange = (event) => {
    event.stopPropagation();

    setEditedFolderName(event.target.value);
    setRenameErrorMessage('');
  };

  const handleSaveFolderName = async () => {
    if (!editedFolderName.trim()) {
      setRenameErrorMessage('Folder name cannot be empty.');
      return;
    }

    try {
      const response = await axios.put(`/api/v1/lsov/folder/${folderId}`, {
        id: folderId,
        name: editedFolderName,
      });

      if (response.status === 200) {
        console.log('Folder renamed successfully:', response.data.data);
        setFolderName(editedFolderName);
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


  // --- Delete Modal State and Handlers (moved from FolderDeleteSection) ---
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const router = useRouter();

  const handleDeleteModalOpen = () => {
    setOpenDeleteModal(true);
    setDeleteErrorMessage('');
    handleMenuClose(); // Close the actions menu when Delete modal opens
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setDeleteErrorMessage('');
  };

  const handleDeleteFolderConfirm = async () => {
    try {
      const response = await axios.delete(`/api/v1/lsov/folder/${folderId}`);

      if (response.status === 200) {
        console.log('Folder deleted successfully:', response.data.message);
        handleDeleteModalClose();
        router.push('/');
      } else {
        console.error('Failed to delete folder:', response);
        setDeleteErrorMessage('Failed to delete folder. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      setDeleteErrorMessage('Error deleting folder. Please try again.');
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
    <div style={{ display: "inline-block" }}>
      <IconButton
        aria-label="folder actions"
        id="folder-actions-menu-button"
        aria-controls={menuOpen ? 'folder-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={handleMenuOpen}
      >
        <MoreVertIcon /> {/* Three-dot icon */}
      </IconButton>
      <Menu
        id="folder-actions-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'folder-actions-menu-button',
        }}
      >
        <MenuItem onClick={handleNewFolderModalOpen}>New Folder</MenuItem> {/* ✅ New Folder menu item */}
        <MenuItem onClick={handleRenameModalOpen}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteModalOpen} sx={{ color: 'error' }}>Delete</MenuItem>
      </Menu>


      {/* Rename Modal (moved from FolderRenameSection) */}
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
            onClick={(event) => event.stopPropagation()} //{/* ✅ STOP EVENT PROPAGATION HERE */}
            error={!!renameErrorMessage}
            helperText={renameErrorMessage}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleRenameModalClose}>Cancel</Button>
            <Button onClick={handleSaveFolderName} variant="contained" sx={{ ml: 1 }}>Save</Button> 1
          </Box>
        </Box>
      </Modal>
      {/* Delete Confirmation Modal (moved from FolderDeleteSection) */}
      <Modal
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        aria-labelledby="delete-folder-modal-title"
        aria-describedby="delete-folder-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="delete-folder-modal-title" variant="h6" component="h2">
            Delete Folder?
          </Typography>
          <Typography id="delete-folder-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this folder? This action cannot be undone.
          </Typography>
          {deleteErrorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>{deleteErrorMessage}</Alert>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleDeleteModalClose}>Cancel</Button>
            <Button onClick={handleDeleteFolderConfirm} variant="contained" color="error" sx={{ ml: 1 }}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* New Folder Modal */}
      <FolderModal // ✅ Render FolderModal for "New Folder"
        openModal={openNewFolderModal}
        handleModalClose={handleNewFolderModalClose}
        newFolderName={newSubfolderName}
        handleFolderNameChange={handleNewSubfolderNameChange}
        handleCreateFolder={handleCreateSubfolder}
        errorMessage={newFolderErrorMessage}
      />
    </div>
  );
};

export default FolderActionsMenu;