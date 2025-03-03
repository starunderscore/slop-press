// components/folders/FolderList.js
import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import axios from 'axios';
import FolderHeader from './FolderHeader'; // ✅ Import FolderHeader
import FolderModal from './FolderModal'; // ✅ Import FolderModal
import FolderItem from './FolderItem';   // ✅ Import FolderItem
import Alert from '@mui/material/Alert';

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get('/api/v1/lsov/folder');
      setFolders(response.data.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setErrorMessage('Error loading folders. Please try again.');
    }
  };

  // --- Menu Handlers ---
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewFolderClick = () => {
    handleMenuClose();
    handleModalOpen();
  };

  // --- Modal Handlers ---
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    setNewFolderName('');
    setErrorMessage('');
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setErrorMessage('Folder name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/lsov/folder', {
        name: newFolderName,
        folderId: null,
      });

      if (response.status === 201) {
        console.log('Folder created successfully:', response.data.data);
        fetchFolders();
        handleModalClose();
      } else {
        console.error('Failed to create folder:', response);
        setErrorMessage('Failed to create folder. Please try again.');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      setErrorMessage('Error creating folder. Please try again.');
    }
  };

  const handleFolderNameChange = (event) => {
    setNewFolderName(event.target.value);
    setErrorMessage('');
  };


  return (
    <div>
      <FolderHeader // ✅ Render FolderHeader component
        handleNewFolderClick={handleNewFolderClick}
        anchorEl={anchorEl}
        menuOpen={menuOpen}
        handleMenuClose={handleMenuClose}
        handleMenuOpen={handleMenuOpen}
      />

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
      )}

      <List>
        {folders.map((folder) => (
          <FolderItem key={folder.id} folder={folder} /> // ✅ Render FolderItem component
        ))}
      </List>

      <FolderModal // ✅ Render FolderModal component
        openModal={openModal}
        handleModalClose={handleModalClose}
        newFolderName={newFolderName}
        handleFolderNameChange={handleFolderNameChange}
        handleCreateFolder={handleCreateFolder}
        errorMessage={errorMessage} // Pass errorMessage to modal
      />
    </div>
  );
};

export default FolderList;
