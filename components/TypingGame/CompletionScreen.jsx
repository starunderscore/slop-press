// src/components/TypingGame/CompletionScreen.js
import React, { useEffect, useState } from 'react'; // ✅ Import useState
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CompletionScreen = ({ overallErrorCount, onRestart, fileId, folderId }) => {
    const router = useRouter();
    const [completionData, setCompletionData] = useState(null); // ✅ State for completion data

    useEffect(() => {
        const updateCompletionCount = async () => {
            if (!fileId) {
                console.warn("File ID is not available to update completion count.");
                return;
            }
            try {
                const response = await fetch(`/api/v1/lsov/typing-game/${fileId}`, {
                    method: 'PUT',
                });
                if (!response.ok) {
                    console.error('Failed to update completion count:', response.statusText);
                } else {
                    const data = await response.json(); // ✅ Parse JSON response
                    console.log('Completion count updated successfully for file ID:', fileId, 'Data:', data); // ✅ Log data
                    setCompletionData(data.data); // ✅ Store completion data in state
                    // Optionally handle success feedback
                }
            } catch (error) {
                console.error('Error updating completion count:', error);
            }
        };

        updateCompletionCount();

    }, [fileId]);


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

            {completionData && completionData.completionCount !== undefined && ( // ✅ Conditionally render completion count
                <Typography variant="body1" gutterBottom>
                    Times completed: {completionData.completionCount}
                </Typography>
            )}


            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Button variant="contained" onClick={onRestart}>
                    Restart Exercise
                </Button>
                <Link href={folderId ? `/folder/${folderId}` : `/`} passHref>
                    <Button variant="outlined">
                        Return to Folder
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default CompletionScreen;