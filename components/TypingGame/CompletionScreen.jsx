// src/components/TypingGame/CompletionScreen.js
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const CompletionScreen = ({ overallErrorCount, onRestart }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Congratulations!
      </Typography>
      <Typography variant="body1" gutterBottom>
        You've completed the exercise.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Total errors: {overallErrorCount}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={onRestart}>
          Restart Exercise
        </Button>
        <Link href="/" passHref>
          <Button variant="outlined">
            Return to List
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default CompletionScreen;
