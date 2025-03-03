// pages/api/v1/lsov/file/[fileId].js
import { db } from '@/models/index.js'; // ✅ Import 'db' from models/index.js
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fileId } = req.query;

  if (!fileId) {
    return res.status(400).json({ message: 'File ID is required' });
  }

  try {
    const fileToDelete = await db.File.findByPk(fileId);

    if (!fileToDelete) {
      return res.status(404).json({ message: 'File not found' });
    }

    // 1. Delete from database
    await fileToDelete.destroy();

    // 2. Delete from file system
    const filePath = fileToDelete.storagePath; // Assuming storagePath stores the full path
    if (filePath) {
      try {
        fs.unlinkSync(filePath); // Use fs.unlinkSync for synchronous deletion (within API route)
        console.log(`File deleted from file system: ${filePath}`);
      } catch (fileSystemError) {
        console.error('Error deleting file from file system:', fileSystemError);
        // Consider: Should a file system delete error rollback the database delete?
        // For now, logging and continuing with database delete is chosen.
        // You might want to implement a more robust rollback mechanism in a production app.
      }
    } else {
      console.warn('File storagePath is not defined, skipping file system deletion.');
    }

    res.status(200).json({ message: 'File deleted successfully', data: { fileId } });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file', error: error.message });
  }
}