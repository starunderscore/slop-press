// models/File.js
import { DataTypes } from 'sequelize';
import FolderModel from './Folder'; // Import Folder MODEL FUNCTION

const FileModel = (sequelize) => {

  const File = sequelize.define('File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    folderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Folders', // <-- This is the bug!
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    completionCount: { // ✅ ADD completionCount column to File model
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'Files',
    paranoid: true,
    timestamps: true,
  });

  File.associate = (models) => {
    File.belongsTo(models.Folder, { foreignKey: 'folderId', as: 'folder' });
  };

  return File;
};

export default FileModel;