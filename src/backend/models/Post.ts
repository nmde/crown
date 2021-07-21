import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IPost from '../../types/Post';

@Table
/**
 * Post table
 */
export default class Post extends Model<IPost> implements IPost {
  @Column(DataType.STRING)
  public media!: string;

  @Column(DataType.STRING)
  public author!: string;

  @Column(DataType.STRING)
  public created!: string;

  @Column(DataType.STRING)
  public expires!: string;

  @Column(DataType.STRING)
  public description!: string;

  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  declare public id: string;

  @Column(DataType.BOOLEAN)
  public visible!: boolean;

  @Column(DataType.STRING)
  public category!: string;
}
