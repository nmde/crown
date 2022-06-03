import {
  Model, DataTypes,
} from 'sequelize';

/**
 * Media table
 */
export default class Media extends Model {}

export const mediaModel = {
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  data: {
    type: DataTypes.TEXT,
  },
  mimeType: {
    type: DataTypes.TEXT,
  },
};
