// pages/api/v1/lsov/typing-game/[id].js
import { db } from "@/models/index"

export default async function handler(req, res) {
  const { id } = req.query;
  console.log('API Request for typing game ID:', id, 'Method:', req.method); // ✅ Log method

  if (!id) {
    return res.status(400).json({ message: 'File ID is required' });
  }

  switch (req.method) {
    case 'GET': {
      try {
        const game = await db.File.findByPk(id);

        if (!game || !game.content) {
          return res.status(404).json({ message: 'Typing game not found or invalid content' });
        }

        console.log('Game selected to play: ', game.content)

        // Ensure markdown is properly a string
        const markdownContent = String(game.content).trim();

        // Debugging log (optional)
        console.log("Fetched Markdown Content:", markdownContent);

        return res.status(200).json({
          name: game.name,
          markdown: markdownContent, // Ensuring markdown is a valid string
          completionCount: game.completionCount,
        });
      } catch (error) {
        console.error("API Error (GET):", error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    case 'PUT': { // ✅ Handle PUT request for completion update
      try {
        const fileToUpdate = await db.File.findByPk(id);
        if (!fileToUpdate) {
          return res.status(404).json({ message: 'File not found for completion update' });
        }

        await fileToUpdate.increment('completionCount'); // ✅ Increment completionCount
        const updatedFile = await db.File.findByPk(id); // Re-fetch to get updated count

        console.log(`File completion count incremented for file ID: ${id}. New count: ${updatedFile.completionCount}`); // ✅ Log completion update

        return res.status(200).json({ message: 'Completion count updated successfully', data: { completionCount: updatedFile.completionCount } }); // ✅ Return updated count
      } catch (error) {
        console.error("API Error (PUT - Completion Update):", error);
        return res.status(500).json({ error: 'Failed to update completion count', error: error.message });
      }
    }
    default: {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  }
}