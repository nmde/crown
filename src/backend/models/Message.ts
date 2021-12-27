import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IMessage from '../../types/Message';

@Table
/**
 * An individual message
 */
export default class Message extends Model<IMessage> implements IMessage {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  declare public id: string;

  @Column(DataType.TEXT)
  public content!: string;

  @Column(DataType.TEXT)
  public sender!: string;

  @Column(DataType.TEXT)
  public time!: string;

  @Column(DataType.TEXT)
  public recipient!: string;
}
