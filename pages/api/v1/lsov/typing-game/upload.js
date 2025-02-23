// pages/api/v1/lsov/typing-game/upload.js
import TypingGame from '@/models/TypingGame';
import sequelize from '@/models/index';
import multer from 'multer';
import matter from 'gray-matter';
import fs from 'fs/promises';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  await sequelize.sync();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return new Promise((resolve, reject) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return reject(res.status(500).json({ error: 'File upload error' }));
      }

      try {
        const fileContent = req.file.buffer.toString('utf-8');
        const parsed = matter(fileContent);

        let name = parsed.data.title || parsed.content.match(/^# (.+)$/m)?.[1];
        if (!name) {
          return res.status(400).json({ error: 'No valid title found in markdown' });
        }

        // Ensure the markdown is stored without escaping backticks
        const newGame = await TypingGame.create({
          name,
          markdown: fileContent.replace(/\\`/g, "`"), // Remove escape slashes from backticks
          completionCount: 0
        });

        resolve(res.status(201).json(newGame));
      } catch (error) {
        reject(res.status(500).json({ error: 'Internal server error' }));
      }
    });
  });
}
