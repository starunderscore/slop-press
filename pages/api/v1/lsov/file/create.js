// pages/api/v1/lsov/file/create.js
import { db } from '@/models'; // Assuming your Sequelize instance is exported as 'db'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed', success: false });
    }

    const { filename, content, folderId } = req.body;

    if (!filename || !content || folderId === undefined) {
        return res.status(400).json({ message: 'Missing required fields: filename, content, folderId', success: false });
    }

    try {
        const newFile = await db.File.create({ // ✅ Use Sequelize File.create to insert into database
            name: filename,
            content: content,
            folderId: folderId, // Associate with the folder
        });

        return res.status(201).json({ message: 'File created successfully', data: newFile, success: true }); // Return success and new file data

    } catch (error) {
        console.error('Error creating file:', error);
        return res.status(500).json({ message: 'Failed to create file', error: error.message, success: false }); // Return error response
    }
}