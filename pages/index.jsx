// pages/index.jsx
import React from 'react';
import Layout from '../components/Layout';
import TopAppBar from '../components/TopAppBar';
import FolderView from "@/components/folders/FolderView"
import { Box } from '@mui/material';

const HomePage = () => {
  return (
    <Layout>
      <TopAppBar />
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          m: "0 auto",
        }}
      >
        <FolderView folderId={null} /> {/* ✅ Render FolderView with folderId={null} */}
      </Box>
    </Layout>
  );
};

export default HomePage;