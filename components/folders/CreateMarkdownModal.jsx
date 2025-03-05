// components/CreateMarkdownModal.js
import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Tooltip from '@mui/material/Tooltip';
import AIPromptModal from '../TopAppBar/AIPromptModal';

const CreateMarkdownModal = ({ open, onClose, onCreateFile }) => { // ✅ onCreateFile prop for future file creation logic
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false); // State for AIPromptModal visibility

  const handleOpenPromptModal = () => setIsPromptModalOpen(true);
  const handleClosePromptModal = () => setIsPromptModalOpen(false);

  useEffect(() => {
    // Auto-generate filename from H1 if content changes and filename is empty
    if (fileName === '' && fileContent.trim() !== '') {
      const firstH1Match = fileContent.match(/^#\s+(.*)/m); // Match H1 at the beginning of a line (multiline flag 'm')
      if (firstH1Match && firstH1Match[1]) {
        setFileName(firstH1Match[1].trim().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')); // Extract H1 text, sanitize for filename
      } else {
        setFileName('default-filename'); // Default filename if no H1 found
      }
    }
  }, [fileContent, fileName]);


  const handleContentChange = (event) => {
    setFileContent(event.target.value);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleCreateFile = () => {
    if (!fileName.trim()) {
      setFileName('default-filename'); // Ensure filename is not empty before creation (fallback) - User can still create file
    }
    // --- Placeholder for actual file creation logic ---
    console.log('Creating file:', fileName + '.md', 'with content:', fileContent);
    if (onCreateFile) {
      onCreateFile(fileName + '.md', fileContent); // Call the onCreateFile prop, passing filename and content
    } else {
      alert('Create File functionality not yet implemented. Check console for data.'); // Temporary alert if onCreateFile is not passed
    }
    onClose(); // Close the modal after "creation" (or attempt)
  };


  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',         // ✅ Use percentage width for responsiveness
    maxWidth: 600,       // ✅ Add maxWidth to limit width on large screens
    maxHeight: '90%',
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-markdown-modal-title"
      aria-describedby="create-markdown-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="create-markdown-modal-title" variant="h6" component="h2">
          Create New Markdown File
        </Typography>

        <Tooltip title="Get AI Prompt for Typing Games">
          <IconButton
            onClick={handleOpenPromptModal}
            aria-label="get AI prompt"
            sx={{ position: 'absolute', top: 8, right: 8 }} // Position top-right
          >
            <LightbulbIcon color="action" />
          </IconButton>
        </Tooltip>


        <Typography sx={{ mt: 2, display: 'block' }} variant="subtitle1" color="textSecondary">
          File Content:
        </Typography>
        <TextField
          multiline
          fullWidth
          rows={15} // Increased rows for better content area
          placeholder="Paste or type your Markdown content here..."
          value={fileContent}
          onChange={handleContentChange}
          variant="outlined"
          margin="dense"
          id="file-content"
        />

        <Typography sx={{ mt: 2, display: 'flex', alignItems: 'center' }} variant="subtitle1" color="textSecondary">
          File Name:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Enter file name (optional, auto-generated from H1)"
            value={fileName}
            onChange={handleFileNameChange}
            variant="outlined"
            margin="dense"
            id="file-name"
          />
          <Typography sx={{ ml: 1, color: 'grey', fontStyle: 'italic' }}>.md</Typography>
        </Box>
        <Typography variant="caption" color="textSecondary" sx={{ ml: 0, mt: 0.5, display: 'block' }}>
          (Auto-generated from first H1 header in content if filename is left empty)
        </Typography>


        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateFile} sx={{ ml: 1 }}>
            Create File
          </Button>
        </Box>

        <AIPromptModal // Render AIPromptModal inside CreateMarkdownModal
          open={isPromptModalOpen}
          onClose={handleClosePromptModal}
        />
      </Box>
    </Modal>
  );
};

export default CreateMarkdownModal;