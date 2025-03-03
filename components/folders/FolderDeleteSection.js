// components/folders/FolderDeleteSection.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete'; // Delete icon
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useRouter } from 'next/router'; // Import useRouter for redirection

const FolderDeleteSection = ({ folderId }) => { // ✅ Receive folderId as prop
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
  const router = useRouter(); // Initialize useRouter hook

  // --- Delete Modal Handlers ---
  const handleDeleteModalOpen = () => {
    setOpenDeleteModal(true);
    setDeleteErrorMessage(''); // Clear any previous error message
  };

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false);
    setDeleteErrorMessage('');
  };

  const handleDeleteFolderConfirm = async () => {
    try {
      const response = await axios.delete(`/api/v1/lsov/folder/${folderId}`); // ✅ DELETE request to delete folder

      if (response.status === 200) {
        console.log('Folder deleted successfully:', response.data.message);
        handleDeleteModalClose(); // Close modal on success
        router.push('/'); // ✅ Redirect to homepage after successful deletion
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
    <div>
      <IconButton aria-label="delete folder" onClick={handleDeleteModalOpen} color="error"> {/* Delete button/icon - color="error" makes it red */}
        <DeleteIcon />
      </IconButton>

      {/* Delete Confirmation Modal */}
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
            <Button onClick={handleDeleteFolderConfirm} variant="contained" color="error" sx={{ ml: 1 }}> {/* Delete button - color="error" makes it red */}
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default FolderDeleteSection;