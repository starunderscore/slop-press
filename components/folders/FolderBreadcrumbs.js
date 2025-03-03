// components/folders/FolderBreadcrumbs.js
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import axios from 'axios'; // ✅ Import axios

const FolderBreadcrumbs = ({ folderId }) => { // ✅ Receive folderId prop, remove folderName
    const [path, setPath] = useState([]); // ✅ State to store folder path
    const [loading, setLoading] = useState(false); // ✅ Loading state
    const [error, setError] = useState('');     // ✅ Error state

    useEffect(() => {
        const fetchFolderPath = async () => {
            // setLoading(true);
            setError('');
            try {
                // Fetch folder path only if folderId is NOT null
                if (folderId) {
                    const response = await axios.get(`/api/v1/lsov/folder/${folderId}/path`);
                    setPath(response.data.data.path); // ✅ Set path state from API response
                } else {
                    setPath([]); // ✅ Set path to empty array for root folder (Home will be added in render)
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching folder path:', error);
                setError('Failed to load folder path.');
                setLoading(false);
            }
        };

        fetchFolderPath(); // Fetch path on component mount/folderId change

    }, [folderId]); // ✅ useEffect dependency on folderId


    if (loading) {
        return <Typography>Loading breadcrumbs...</Typography>; // Loading message
    }

    if (error) {
        return <Typography color="error">{error}</Typography>; // Error message
    }


    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
            <Link color="inherit" href="/" key="home"> {/* Home link - always the first segment */}
                <Typography color="inherit">Home</Typography>
            </Link>
            {path.map((folder, index) => ( // ✅ Map over the path array
                index < path.length - 1 ? ( // If not the last item, render as Link
                    <Link color="inherit" href={`/folder/${folder.id}`} key={folder.id}>
                        <Typography color="inherit">{folder.name}</Typography>
                    </Link>
                ) : ( // If last item (current folder), render as Typography (not a link)
                    <Typography color="text.primary" key={folder.id}>{folder.name}</Typography>
                )
            ))}
        </Breadcrumbs>
    );
};

export default FolderBreadcrumbs;