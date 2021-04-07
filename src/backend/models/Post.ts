import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IPost from '../../types/Post';

@Table
/**
 * Post table
 */
export default class Post extends Model<Post> implements IPost {
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
  public id!: string;
}
