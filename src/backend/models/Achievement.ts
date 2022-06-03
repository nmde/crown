import { DataTypes, Model } from 'sequelize';

/**
 * Comment table
 */
export default class Achievement extends Model {}

export const achievementModel = {
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  progress: {
    type: DataTypes.INTEGER,
  },
  user: {
    type: DataTypes.TEXT,
  },
}
