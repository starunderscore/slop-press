// components/folders/FolderItemActionsMenu.js
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

const FolderItemActionsMenu = ({ folderId, folderName, onFolderContentsUpdated }) => { // ✅ Receive folderId, folderName, onFolderContentsUpdated as props
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const router = useRouter(); // ✅ Get router instance

  // --- Menu Handlers ---
  const handleMenuOpen = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleViewOpenFolder = async (event) => {
    console.log(`View/Open folder: ${folderName} (ID: ${folderId}) - Navigating...`);
    router.push(`/folder/${folderId}`);
    handleMenuClose(event);
  };


  // --- Rename Modal State and Handlers (moved from FolderRenameSection - and modified for FolderItemActionsMenu) ---
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [editedFolderName, setEditedFolderName] = useState('');
  const [renameErrorMessage, setRenameErrorMessage] = useState('');

  const handleRenameModalOpen = (event) => {
    handleMenuClose(event);
    setEditedFolderName(folderName);
    setOpenRenameModal(true);
    setRenameErrorMessage('');
  };

  const handleRenameModalClose = (event) => {
    event.stopPropagation()

    setOpenRenameModal(false);
    setEditedFolderName('');
    setRenameErrorMessage('');
  };

  const handleFolderNameEditChange = (event) => {
    setEditedFolderName(event.target.value);
    setRenameErrorMessage('');
  };

  const handleSaveFolderName = async (event) => {
    event.stopPropagation()

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
        // setFolderName(editedFolderName); // ❌ setFolderName prop is not passed to FolderItemActionsMenu, refresh folder contents instead
        handleRenameModalClose(event);
        onFolderContentsUpdated(); // ✅ Refresh folder list to reflect rename
      } else {
        console.error('Failed to rename folder:', response);
        setRenameErrorMessage('Failed to rename folder. Please try again.');
      }
    } catch (error) {
      console.error('Error renaming folder:', error);
      setRenameErrorMessage('Error renaming folder. Please try again.');
    }
  };


  // --- Delete Modal State and Handlers (moved from FolderDeleteSection - and modified for FolderItemActionsMenu) ---
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');


  const handleDeleteModalOpen = (event) => {
    setOpenDeleteModal(true);
    setDeleteErrorMessage('');
    handleMenuClose(event);
  };

  const handleDeleteModalClose = (event) => {
    event.stopPropagation()
    
    setOpenDeleteModal(false);
    setDeleteErrorMessage('');
  };

  const handleDeleteFolderConfirm = async (event) => {
    event.stopPropagation()
    try {
      const response = await axios.delete(`/api/v1/lsov/folder/${folderId}`);

      if (response.status === 200) {
        console.log('Folder deleted successfully:', response.data.message);
        handleDeleteModalClose(event);
        onFolderContentsUpdated(); // ✅ Refresh folder list after deletion
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
        id="folder-item-actions-menu-button"
        aria-controls={menuOpen ? 'folder-item-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={handleMenuOpen}
      >
        <MoreVertIcon /> {/* Three-dot icon */}
      </IconButton>
      <Menu
        id="folder-item-actions-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'folder-item-actions-menu-button',
        }}
      >
        <MenuItem onClick={handleViewOpenFolder}>View/Open</MenuItem> {/* ✅ View/Open menu item */}
        <MenuItem onClick={handleRenameModalOpen}>Rename</MenuItem>
        <MenuItem onClick={handleDeleteModalOpen} sx={{ color: 'error' }}>Delete</MenuItem>
      </Menu>

      {/* Rename Modal (moved from FolderRenameSection - and modified for FolderItemActionsMenu) */}
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

      {/* Delete Confirmation Modal (moved from FolderDeleteSection - and modified for FolderItemActionsMenu) */}
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
    </div>
  );
};

export default FolderItemActionsMenu;