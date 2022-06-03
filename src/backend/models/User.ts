import {
  Model, DataTypes,
} from 'sequelize';

/**
 * User table
 */
export default class User extends Model {}

export const userModel = {
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  username: {
    type: DataTypes.TEXT,
  },
  password: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.TEXT,
  },
  lastTokenReset: {
    type: DataTypes.INTEGER,
  },
  displayName: {
    type: DataTypes.STRING,
  },
  profileBackground: {
    type: DataTypes.STRING,
  },
  profilePicture: {
    type: DataTypes.STRING,
  },
  boostBalance: {
    type: DataTypes.INTEGER,
  },
};
