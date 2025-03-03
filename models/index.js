// models/index.js
'use strict';

import Sequelize from 'sequelize';
import process from 'process';
import FolderModel from './Folder.js'; // Keep these imports
import FileModel from './File.js';

const env = process.env.NODE_ENV || 'development';
const db = {};

// ✅ Get Sequelize config from environment variables (no changes here)
const sequelizeOptions = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false,
    } : undefined,
  },
};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);
} else {
  sequelize = new Sequelize(sequelizeOptions.database, sequelizeOptions.username, sequelizeOptions.password, sequelizeOptions);
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ✅ Initialize models - PASS sequelize instance as argument
db.Folder = FolderModel(sequelize);
// db.TypingGame = TypingGameModel(sequelize); // ❌ REMOVE this line
db.File = FileModel(sequelize);

// ✅ Associations (if any) - keep these
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


export { sequelize, db }; // ✅ CHANGED: Export both sequelize and db

db.sequelize.sync({}); // Add sync to ensure database is in sync with models