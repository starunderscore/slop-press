import TypingGame from '@/models/TypingGame';
import sequelize from '@/models/index';
import matter from 'gray-matter';

export default async function handler(req, res) {
    await sequelize.sync();

    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const game = await TypingGame.findByPk(id);

        if (!game || !game.markdown) {
            return res.status(404).json({ message: 'Typing game not found or invalid content' });
        }

        // Ensure markdown is properly a string
        const markdownContent = String(game.markdown).trim();

        // Debugging log (optional)
        console.log("Fetched Markdown Content:", markdownContent);

        return res.status(200).json({
            name: game.name,
            markdown: markdownContent, // Ensuring markdown is a valid string
            completionCount: game.completionCount,
        });
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
