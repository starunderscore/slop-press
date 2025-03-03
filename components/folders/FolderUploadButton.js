// components/folders/FolderUploadButton.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Import UploadFile icon
import Typography from '@mui/material/Typography'; // Import Typography for status message
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


const FolderUploadButton = ({ folderId, onFileUploadSuccess }) => { // ✅ Receive folderId and onFileUploadSuccess props
  const [uploadStatusMessage, setUploadStatusMessage] = useState(''); // State for upload status message

  const handleFileUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log("Form submission started"); // ✅ Log: Form submission started

    const form = event.target.closest('form'); // ✅ Correct - Traverse up to find the <form> element
    if (!form) {
      console.error("Form element not found!"); // Safety check: Log error if form is still not found
      return; // Exit function if form is not found
    }
    console.log("Form element:", form); // ✅ Log: Form element

    const formData = new FormData(form); // Create FormData from the form
    console.log("FormData object:", formData); // ✅ Log: FormData object
    for (var pair of formData.entries()) {  // ✅ Log: Iterate through FormData and log entries
      console.log(pair[0] + ', ' + pair[1]);
    }

    setUploadStatusMessage('Uploading...');

    try {
      const response = await fetch('/api/v1/lsov/file/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUploadStatusMessage('File uploaded successfully!');
        console.log('File upload successful:', data);
        if (onFileUploadSuccess) { // ✅ Call onFileUploadSuccess if provided
          onFileUploadSuccess(); // Trigger folder content refresh in parent component
        }
      } else {
        setUploadStatusMessage(`File upload failed: ${data.message || 'Unknown error'}`);
        console.error('File upload failed:', data);
      }

    } catch (error) {
      setUploadStatusMessage('File upload error: ' + error.message);
      console.error('File upload error:', error);
    }
  };


  return (
    <Box component="span"> {/* Use Box with component="span" for inline layout */}
      <Tooltip title="Upload File">
        <IconButton color="primary" aria-label="upload file" component="span"> {/* IconButton acts as a trigger */}
          <form onSubmit={handleFileUpload} style={{ display: 'none' }}> {/* Hidden form */}
            <input type="hidden" name="folderId" value={folderId || ''} /> {/* Hidden input for folderId */}
            <input
              type="file"
              name="file"
              id="fileInputButton"
              onChange={() => { document.getElementById('submitButton').click(); }} // Trigger submit on file select
            />
            <Button type="submit" id="submitButton">Submit</Button> {/* Hidden submit button */}
          </form>
          <UploadFileIcon onClick={() => { document.getElementById('fileInputButton').click(); }} /> {/* Icon to trigger file input */}
        </IconButton>
      </Tooltip>
      {uploadStatusMessage && ( // Status message display
        <Typography variant="caption" sx={{ display: 'block' }}>
          {uploadStatusMessage}
        </Typography>
      )}
    </Box>
  );
};

export default FolderUploadButton;