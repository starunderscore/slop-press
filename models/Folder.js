// models/Folder.js
import { DataTypes } from 'sequelize'; // Keep DataTypes import

// ✅ CHANGE the module.exports wrapper to a function that accepts sequelize
const FolderModel = (sequelize) => { // ✅  Accept sequelize as argument

  const Folder = sequelize.define('Folder', { // Define model as usual, using the passed-in sequelize
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    folderId: { //  `folderId` for parent-child relationship
      type: DataTypes.UUID,
      allowNull: true, // Null for root folders
      references: {
        model: 'Folders',
        key: 'id',
      },
    },
    // ... (rest of your Folder model definition - keep this the same) ...
  }, {
    tableName: 'Folders',
    paranoid: true,
  });

  Folder.associate = (models) => {
    Folder.belongsTo(models.Folder, {
      foreignKey: 'parentId',
      as: 'parent', // Alias for parent folder association (already might exist)
    });

    Folder.hasMany(models.Folder, {
      foreignKey: 'folderId', // ✅ Foreign key in Child Folder records pointing to Parent Folder - CORRECT foreignKey to 'folderId'
      sourceKey: 'id',       // ✅ Source key is the id of the Parent Folder
      as: 'subfolders', // ✅ Alias for subfolders self-association - ADD THIS ALIAS
    });

    Folder.hasMany(models.File, {
      foreignKey: 'folderId',
      as: 'files',      // ✅ Alias for files association - ADD THIS ALIAS
    });
  };

  return Folder;
};

export default FolderModel; // ✅ Export the MODEL FUNCTION, not the Model class directly