// components/folders/FolderView.js
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router'; // ✅ Import useRouter (though not directly used here, might be useful later or in child components)
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FolderBreadcrumbs from '@/components/folders/FolderBreadcrumbs';
import FolderUploadButton from '@/components/folders/FolderUploadButton';
import FolderActionsMenu from '@/components/folders/FolderActionsMenu';
import FolderContentList from '@/components/folders/FolderContentList';
import { Container } from '@mui/material';

const FolderView = ({ folderId }) => { // ✅ FolderView component, accepts folderId prop
  const [folderName, setFolderName] = useState('Loading...');
  const [errorMessage, setErrorMessage] = useState('');
  const [folderContents, setFolderContents] = useState([]);
  const [uploadStatusMessage, setUploadStatusMessage] = useState('');

  const refreshFolderContents = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/lsov/folder/${folderId}/contents`); // ✅ Use folderId prop in API call
      console.log('API Response (refreshFolderContents in FolderView):', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Parsed JSON Data (refreshFolderContents in FolderView):', data);
      console.log('Data.data to setFolderContents (refreshFolderContents in FolderView):', data.data);

      setFolderContents(data.data || { folders: [], files: [] });

      // --- ADDED CONSOLE LOG HERE ---
      console.log('Data.data before setting folderName:', data.data);
      if (data.data && data.data.name) {
        setFolderName(data.data.name);
      } else {
        console.warn('Folder Name not found in data.data, using fallback.');
        setFolderName("No Name Available"); // Fallback name if name is missing
      }


    } catch (error) {
      console.error('Error refreshing folder contents in FolderView:', error);
      setFolderName("Error Loading Name"); // Set error name on error
    }
  }, [folderId, setFolderContents]); // ✅ useCallback dependencies: folderId, setFolderContents


  useEffect(() => {
    console.log('useEffect in FolderView is running, folderId:', folderId);

    if (folderId) {
      refreshFolderContents();
    } else {
      console.warn('Folder ID is undefined in FolderView, fetching root content if API handles it.');
      refreshFolderContents(); // ✅ Fetch root content when folderId is null/undefined (API should handle root)
    }
  }, [folderId, refreshFolderContents]); // ✅ useEffect dependencies: folderId, memoized refreshFolderContents


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <FolderBreadcrumbs folderId={folderId} /> {/* ✅ Pass folderId prop */}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{ fontSize: '1.7rem' }}
        >
          {folderName}
        </Typography>
        <div> {/* Container for buttons on the right */}
          <FolderUploadButton folderId={folderId} onFileUploadSuccess={refreshFolderContents} /> {/* ✅ Pass folderId and refresh function */}
          <FolderActionsMenu
            folderId={folderId}
            folderName={folderName} // ✅ Pass folderName - important for RenameFolderDialog
            setFolderName={setFolderName}
            onFolderContentsUpdated={refreshFolderContents}
          />
        </div>
      </Box>

      <Divider sx={{ marginBottom: 2 }} />

      <FolderContentList
        folderId={folderId}
        onFolderContentsUpdated={refreshFolderContents}
        folderContents={folderContents} // ✅ Pass folderContents prop
      />
    </Container>
  );
};

export default FolderView;