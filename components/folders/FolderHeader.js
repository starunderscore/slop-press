// components/folders/FolderHeader.js
import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const FolderHeader = ({ handleNewFolderClick, anchorEl, menuOpen, handleMenuClose, handleMenuOpen }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <Typography variant="h6" component="div">
        Folders
      </Typography>
      <div>
        <IconButton
          aria-label="more"
          id="folder-menu-button"
          aria-controls={menuOpen ? 'folder-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="folder-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'folder-menu-button',
          }}
        >
          <MenuItem onClick={handleNewFolderClick}>New Folder</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default FolderHeader;