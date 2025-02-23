// models/TypingGame.js
import { DataTypes } from 'sequelize';
import sequelize from './index';

const TypingGame = sequelize.define('TypingGame', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    markdown: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    completionCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});


  export default TypingGame;