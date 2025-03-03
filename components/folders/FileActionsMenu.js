// components/folders/FileActionsMenu.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const FileActionsMenu = ({ fileId, filename, onFileActionsUpdated, folderId }) => { 
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [deleteError, setDeleteError] = useState('');         // State for delete error message

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // --- Play Functionality ---
  const handlePlay = (event) => {
    event.stopPropagation();
    // ✅ Add folderId as query parameter
    router.push({
      pathname: `/play/${fileId}`,
      query: { folderId: folderId },
    });
  }

  // --- Delete File Functionality ---
  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
    handleClose(); // Close the actions menu
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setDeleteError('');      // Clear any previous errors when closing modal
  };

  const confirmDeleteFile = async () => {
    setDeleteError(''); // Clear any previous errors
    try {
      const response = await fetch(`/api/v1/lsov/file/${fileId}`, { // ✅ Call DELETE API endpoint
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete file');
      }

      console.log('File deleted successfully.');
      handleDeleteModalClose(); // Close the modal
      if (onFileActionsUpdated) {
        onFileActionsUpdated(); // Refresh folder contents in parent component
      }

    } catch (error) {
      console.error('Error deleting file:', error);
      setDeleteError(error.message || 'Error deleting file. Please try again.');
    }
  };

  // --- Download File Functionality ---
  const handleDownloadFile = async () => {
    try {
      const response = await fetch(`/api/v1/lsov/file/download/${fileId}`); // ✅ Call download API

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download file');
      }

      const blob = await response.blob(); // ✅ Get response as Blob
      const url = window.URL.createObjectURL(blob); // ✅ Create Blob URL
      const a = document.createElement('a'); // ✅ Create download link element
      a.href = url;
      a.download = filename; // ✅ Set filename for download
      document.body.appendChild(a); // ✅ Append to body (required for Firefox)
      a.click(); // ✅ Programmatically click link to start download
      document.body.removeChild(a); // ✅ Remove link from body
      window.URL.revokeObjectURL(url); // ✅ Release Blob URL


      handleClose(); // Close menu after download starts

    } catch (error) {
      console.error('Download error:', error);
      // Basic error handling - you might want to show a user-friendly error message
      alert(`Download failed: ${error.message}`); // Simple alert for now
    }
  };


  return (
    <div>
      <IconButton
        aria-label="more"
        id="file-actions-button"
        aria-controls={open ? 'file-actions-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="file-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'file-actions-button',
        }}
      >
        <MenuItem onClick={handlePlay}>Play</MenuItem>
        <MenuItem onClick={handleDownloadFile}>Download</MenuItem>     {/* Download action */}
        <MenuItem onClick={handleDeleteModalOpen}>Delete</MenuItem>         {/* Delete action - opens modal */}
      </Menu>

      {/* --- Delete Confirmation Modal --- */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete File?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the file "{filename}"? This action cannot be undone.
          </DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteModalClose}>Cancel</Button>
          <Button onClick={confirmDeleteFile} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileActionsMenu;