// pages/folder/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import TopAppBar from '@/components/TopAppBar';
import FolderView from '@/components/folders/FolderView'; // ✅ Import FolderView
import { Box } from '@mui/material';

const FolderPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get folderId from router query

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
        <FolderView folderId={id} /> {/* ✅ Render FolderView and pass folderId from query */}
      </Box>
    </Layout>
  );
};

export default FolderPage;