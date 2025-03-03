// pages/api/v1/lsov/folder/[id]/path.js
import { db } from '@/models/index.js'; // ✅ Import 'db'

export default async function handler(req, res) {
  const { id: folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ success: false, message: 'Folder ID is required.' });
  }

  if (req.method === 'GET') {
    try {
      const currentFolder = await db.Folder.findByPk(folderId);
      if (!currentFolder) {
        return res.status(404).json({ success: false, message: 'Folder not found.' });
      }

      const path = [];
      let ancestorFolder = currentFolder;

      while (ancestorFolder && ancestorFolder.folderId) { // ✅ Traverse up the hierarchy using folderId
        ancestorFolder = await db.Folder.findByPk(ancestorFolder.folderId);
        if (ancestorFolder) {
          path.unshift(ancestorFolder); // ✅ Add parent folder to the beginning of the path array
        } else {
          break; // Break in case of data inconsistency (parent folder not found, avoid infinite loop)
        }
      }

      path.push(currentFolder); // ✅ Add the current folder to the end of the path


      res.status(200).json({
        success: true,
        message: 'Folder path fetched successfully.',
        data: {
          path: path,
        },
      });
    } catch (error) {
      console.error('Error fetching folder path:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch folder path.', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}