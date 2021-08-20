import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IComment from '../../types/Comment';

@Table
/**
 * Comment table
 */
export default class Comment extends Model<IComment> implements IComment {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column(DataType.TEXT)
  public text!: string;

  @Column(DataType.TEXT)
  public author!: string;

  @Column(DataType.TEXT)
  public parent!: string;
}
