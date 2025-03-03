// pages/api/v1/lsov/folder/[id].js
import { db } from '@/models/index.js'; // ✅ Import 'db' from models/index.js

export default async function handler(req, res) {
  const { id } = req.query; // Get the folder ID from the URL query parameters

  if (!id) {
    return res.status(400).json({ success: false, message: 'Folder ID is required.' });
  }

  if (req.method === 'GET') {
    // GET: Get a folder by ID
    try {
      const folder = await db.Folder.findByPk(id);

      if (!folder) {
        return res.status(404).json({ success: false, message: 'Folder not found.' });
      }

      res.status(200).json({ success: true, data: folder });
    } catch (error) {
      console.error('Error fetching folder by ID:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch folder.', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // DELETE: Delete a folder (soft delete)
    try {
      const folder = await db.Folder.findByPk(id);

      if (!folder) {
        return res.status(404).json({ success: false, message: 'Folder not found.' });
      }

      await folder.destroy(); // Soft delete

      res.status(200).json({ success: true, message: 'Folder deleted successfully.' });
    } catch (error) {
      console.error('Error deleting folder:', error);
      res.status(500).json({ success: false, message: 'Failed to delete folder.', error: error.message });
    }
  } else if (req.method === 'PUT') {
    // PUT: Update an existing folder
    const { id, name, folderId } = req.body; // Get update data from request body

    if (!id) {
      return res.status(400).json({ success: false, message: 'Folder ID is required for update.' });
    }

    try {
      const [updatedRowsCount, updatedFolders] = await db.Folder.update(
        { name, folderId }, // Fields to update
        {
          where: { id },    // Condition: update folder with this ID
          returning: true, // Return the updated records
        }
      );

      if (updatedRowsCount === 0) {
        return res.status(404).json({ success: false, message: 'Folder not found for update.' });
      }

      const updatedFolder = await db.Folder.findByPk(id); // Re-fetch to get the full updated object (including associations if any)

      res.status(200).json({ success: true, message: 'Folder updated successfully.', data: updatedFolder });
    } catch (error) {
      console.error('Error updating folder:', error);
      res.status(500).json({ success: false, message: 'Failed to update folder.', error: error.message });
    }
  }
  else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}