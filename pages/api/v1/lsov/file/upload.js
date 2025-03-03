// pages/api/v1/lsov/file/upload.js
import middleware from '@/middleware/middleware';
import { db } from '@/models/index.js';
import fs from 'fs'; // ✅ Import 'fs' module

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
  }

  await middleware.formDataParser(req, res, async (err) => {
    if (err) {
      console.error('Form data parsing error:', err);
      return res.status(500).json({ success: false, message: 'Failed to parse form data.', error: err.message });
    }

    try {
      const folderId = req.body.folderId[0]; // Get folderId from request body
      const file = req.files.file;

      if (!file || !Array.isArray(file) || file.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded or invalid file data.' });
      }

      const uploadedFile = file[0]; // Get the first file from the array
      const fileName = uploadedFile.originalFilename;
      const fileSize = uploadedFile.size;
      const fileType = uploadedFile.mimetype;
      const filePath = uploadedFile.filepath; // ✅ Get temporary file path

      if (!fileName || !fileName.trim()) {
        return res.status(400).json({ success: false, message: 'File name cannot be empty.' });
      }

      const allowedMimeTypes = ['text/markdown', 'text/plain'];
      if (!allowedMimeTypes.includes(fileType)) {
        return res.status(400).json({ success: false, message: 'Invalid file type. Allowed types: .md, .txt' });
      }

      let fileContent = ''; // Initialize fileContent
      try {
        fileContent = fs.readFileSync(filePath, 'utf8'); // ✅ Read file content from temporary path as UTF-8
      } catch (readError) {
        console.error('Error reading file content:', readError);
        return res.status(500).json({ success: false, message: 'Failed to read file content.', error: readError.message });
      }


      const newFile = await db.File.create({
        name: fileName,
        originalName: fileName, // ✅ Store original filename
        mimeType: fileType,     // ✅ Store MIME type
        size: fileSize,         // ✅ Store file size
        folderId: folderId || null,
        content: fileContent,     // ✅ Store read file content in database
        storagePath: null,       // ✅ No storage path needed as content is in DB
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully.',
        data: { file: newFile },
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, message: 'Failed to upload file.', error: error.message });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};