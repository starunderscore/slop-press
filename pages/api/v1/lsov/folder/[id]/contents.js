// pages/api/v1/lsov/folder/[id]/contents.js
import { db } from '@/models'; // Import your Sequelize models

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id: folderId } = req.query; // Extract folderId from query params
  console.log(`API Request for folder contents. Folder ID: ${folderId ? folderId : 'ROOT'}`); // ✅ Log folder ID

  try {
    let folderData;

    if (folderId && folderId !== "null") { // ✅ Check if folderId is present and not "null" string
      const folder = await db.Folder.findOne({
        where: { id: folderId },
        include: [
          {
            model: db.Folder,
            as: 'subfolders',
          },
          {
            model: db.File,
            as: 'files',
          },
        ],
      });

      if (!folder) {
        return res.status(404).json({ success: false, message: 'Folder not found' });
      }

      folderData = {
        id: folder.id === "null" ? null : folder.id, // Keep this line as in your rolled-back code
        name: folder.name,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        folders: folder.subfolders.map(subfolder => ({
          id: subfolder.id,
          name: subfolder.name,
          createdAt: subfolder.createdAt,
          updatedAt: subfolder.updatedAt,
        })),
        files: folder.files.map(file => ({
          id: file.id,
          name: file.name,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
          completionCount: file.completionCount,
        })),
      };
    } else {
      // Fetch root folder contents (when folderId is null or undefined)
      const rootFolders = await db.Folder.findAll({
        where: { folderId: null }, // ✅ Fetch folders with folderId: null (root folders) - IMPORTANT: Use 'folderId: null' based on your model
        as: 'subfolders', // Added as per your model
      });
      const rootFiles = await db.File.findAll({
        where: { folderId: null }, // ✅ Fetch files with folderId: null (root files) - IMPORTANT: Use 'folderId: null' based on your model
        as: 'files', // Added as per your model
      });


      folderData = {
        id: null, // Indicate root folder
        name: 'Root',
        createdAt: new Date(), // Mock dates for root folder
        updatedAt: new Date(),
        folders: rootFolders.map(subfolder => ({
          id: subfolder.id,
          name: subfolder.name,
          createdAt: subfolder.createdAt,
          updatedAt: subfolder.updatedAt,
        })),
        files: rootFiles.map(file => ({
          id: file.id,
          name: file.name,
          createdAt: file.createdAt,
          updatedAt: file.updatedAt,
          completionCount: file.completionCount,
        })),
      };
      console.log('Fetched ROOT Folder Contents (rolled-back API version):', folderData); // ✅ Log root folder contents
    }


    res.status(200).json({ success: true, data: folderData });

  } catch (error) {
    console.error('Failed to fetch folder contents:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch folder contents.', error: error.message });
  }
}