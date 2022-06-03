import {
  Model, DataTypes,
} from 'sequelize';
import { IMessage } from '../../types';

/**
 * An individual message
 */
export default class Message extends Model {}

export const messageModel = {
  id: {
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID,
  },
  content: {
    type: DataTypes.TEXT,
  },
  sender: {
    type: DataTypes.TEXT,
  },
  time: {
    type: DataTypes.TEXT,
  },
  recipient: {
    type: DataTypes.TEXT,
  },
};
