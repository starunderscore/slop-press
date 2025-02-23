// pages/api/v1/lsov/typing-game/index.js
import TypingGame from '@/models/TypingGame';
import sequelize from '@/models/index';

export default async function handler(req, res) {
    await sequelize.sync();
    
    switch (req.method) {
        case 'POST': {
            const { title, content } = req.body;
            const newGame = await TypingGame.create({ title, content });
            return res.status(201).json(newGame);
        }
        case 'GET': {
            const games = await TypingGame.findAll();
            return res.status(200).json(games);
        }
        case 'PUT': {
            const { id, ...updatedGame } = req.body;
            await TypingGame.update(updatedGame, { where: { id } });
            return res.status(200).json({ message: 'Updated successfully' });
        }
        case 'DELETE': {
            const { id } = req.body;
            await TypingGame.destroy({ where: { id } });
            return res.status(200).json({ message: 'Deleted successfully' });
        }
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}
