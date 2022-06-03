import {
  Model, DataTypes,
} from 'sequelize';

/**
 * Edge relationship table
 */
export default class Edge extends Model {}

export const edgeModel = {
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  source: {
    type: DataTypes.TEXT,
  },
  target: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.TEXT,
  },
};
