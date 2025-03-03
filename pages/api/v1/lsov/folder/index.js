// pages/api/v1/lsov/folder/index.js
// import db from '../../../../../models';
import { db } from '@/models/index.js'; // ✅ Import 'db' from models/index.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // GET: List folders (existing GET logic - keep this)
    try {
      const folders = await db.Folder.findAll({
        where: {
          folderId: null, // Fetch root folders initially (you can adjust this later)
          deletedAt: null, // Only get non-deleted folders
        },
      });
      res.status(200).json({ success: true, data: folders });
    } catch (error) {
      console.error('Error fetching folders:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch folders.', error: error.message });
    }
  } else if (req.method === 'POST') {
    // POST: Create a new folder (existing POST logic - keep this)
    const { name, folderId } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name is required.' });
    }

    try {
      const newFolder = await db.Folder.create({ name, folderId });
      res.status(201).json({ success: true, data: newFolder, message: 'Folder created successfully.' });
    } catch (error) {
      console.error('Error creating folder:', error);
      res.status(500).json({ success: false, message: 'Failed to create folder.', error: error.message });
    }
  }
  else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}