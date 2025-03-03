// components/folders/FolderContentList.js
import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // ✅ Import File icon
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography'; // Import Typography
import FileActionsMenu from './FileActionsMenu'; // ✅ Import FileActionsMenu
import Link from 'next/link';
import FolderActionsMenu from './FolderActionsMenu';
import FolderItemActionsMenu from './FolderItemActionsMenu';

const FolderContentList = ({ folderId, onFolderContentsUpdated, folderContents }) => { // ✅ Receive folderContents prop
  console.log('FolderContentList folderContents prop:', folderContents); // ✅ Log folderContents prop
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const subfolders = folderContents?.folders || []; // Extract subfolders
  const files = folderContents?.files || [];       // ✅ Extract files


  useEffect(() => { // ✅ Simplified useEffect for loading/error states on folderId change
    setLoading(true);
    setError('');
    if (folderId) {
      setLoading(false); // Just set loading to false when folderId prop changes (data comes from props now)
    } else {
      setLoading(false); // Handle case where folderId is initially null/undefined
    }
  }, [folderId]);


  if (loading) {
    return <Typography>Loading folder contents...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!folderContents || folderContents.length === 0) { // ✅ Check folderContents prop for emptiness
    return <Typography>This folder is empty.</Typography>;
  }

  const handleDeleteFolder = async (subfolderId) => {
    // ... (your existing handleDeleteFolder function - no changes needed) ...
  };

  return (
    <List>
      {/* --- Render Subfolders --- */}
      {subfolders.length > 0 && subfolders.map((subfolder) => (
        <ListItem button key={subfolder.id}  > {/* ✅ Remove component="a" and to prop from ListItem */}
          <Link href={`/folder/${subfolder.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'contents' }}> {/* ✅ Wrap ListItem content with Link */}
            <ListItemIcon>
              <FolderIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={subfolder.name} />
            {/* ✅ REPLACED IconButton with FolderItemActionsMenu */}
            <FolderItemActionsMenu
              folderId={subfolder.id}
              folderName={subfolder.name}
              onFolderContentsUpdated={onFolderContentsUpdated} />
          </Link>
        </ListItem>
      ))}

      {/* --- Render Files --- */}
      {files.length > 0 && files.map((file) => (      // ✅ Map over files array
        <ListItem button key={file.id} > {/* ✅  ListItem is now button and wrapped in Link */}
          <Link href={`/play/${file.id}?folderId=${folderId}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'flex', alignItems: 'center' }}> {/* ✅ Wrap ListItem content with Link, pass folderId in query */}
            <ListItemIcon>
              <InsertDriveFileIcon /> {/* File Icon */}
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={`File ${file.completionCount > 0 ? `- Completed (${file.completionCount}) time(s)` : ''}`}  // ✅ Updated secondary text
            /> {/* ✅ Display filename, updated secondary text */}
          </Link>
          <Box sx={{ ml: 2 }}> {/*  ✅ Box to push FileActionsMenu to the right */}
            <FileActionsMenu
              fileId={file.id}
              filename={file.name}
              onFileActionsUpdated={onFolderContentsUpdated}
              folderId={folderId} // ✅ Pass folderId prop here
            /> {/* ✅ FileActionsMenu - Moved OUTSIDE Link, beside ListItemText */}
          </Box>
        </ListItem>
      ))}


      {/* --- Display "No items" message if both subfolders and files are empty --- */}
      {subfolders.length === 0 && files.length === 0 && (
        <ListItem>
          <ListItemText
            primary={<Typography variant="subtitle1" color="textSecondary">No items in this folder.</Typography>}
          />
        </ListItem>
      )}
    </List>
  );
};

export default FolderContentList;