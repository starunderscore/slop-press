// components/folders/FolderItem.js
import React from 'react';
import Link from 'next/link'; // ✅ Import Link from next/link
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const FolderItem = ({ folder }) => {
  return (
    <ListItem key={folder.id} button component={Link} href={`/folder/${folder.id}`} > {/* ✅ Wrap ListItem in Link */}
      <ListItemText primary={folder.name} />
    </ListItem>
  );
};

export default FolderItem;