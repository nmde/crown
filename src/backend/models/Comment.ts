import {
  Model, DataTypes,
} from 'sequelize';

/**
 * Comment table
 */
export default class Comment extends Model {}

export const commentModel = {
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  text: {
    type: DataTypes.TEXT,
  },
  author: {
    type: DataTypes.TEXT,
  },
  parent: {
    type: DataTypes.TEXT,
  },
};
