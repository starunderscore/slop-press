// pages/api/v1/lsov/file/download/[fileId].js
import { db } from '@/models/index.js'; // ✅ Import 'db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('req.query');

  const { fileId } = req.query;

  console.log('fileId', fileId);

  if (!fileId) {
    return res.status(400).json({ message: 'File ID is required' });
  }

  try {
    const fileToDownload = await db.File.findByPk(fileId);

    if (!fileToDownload) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileContent = fileToDownload.content || ""; // ✅ Get file content directly from database

    // if (!fileContent) {
    //   return res.status(404).json({ message: 'File content not found in database.' }); // Check for content in DB
    // }

    const fileName = fileToDownload.originalName || fileToDownload.name || 'downloaded-file'; // Fallback filename
    const mimeType = fileToDownload.mimeType || 'text/plain'; // Default to text/plain for database content


    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', Buffer.byteLength(fileContent, 'utf8')); // ✅ Content-Length based on content length

    res.status(200).send(fileContent); // ✅ Send file content from database


  } catch (error) {
    console.error('Error downloading file from database:', error); // ✅ Updated error log message
    res.status(500).json({ message: 'Failed to download file from database', error: error.message }); // ✅ Updated error message
  }
}