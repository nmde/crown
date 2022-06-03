/**
 * @file Post model.
 */
import {
  Model, DataTypes,
} from 'sequelize';

/**
 * Post table.
 */
export default class Post extends Model {}

export const postModel = {
  media: {
    type: DataTypes.TEXT,
  },
  author: {
    type: DataTypes.TEXT,
  },
  created: {
    type: DataTypes.TEXT,
  },
  expires: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  visible: {
    type: DataTypes.BOOLEAN,
  },
  category: {
    type: DataTypes.TEXT,
  },
  boosts: {
    type: DataTypes.INTEGER,
  },
  tags: {
    type: DataTypes.STRING,
  },
};
