import {
  Model, Table, Column, DataType,
} from 'sequelize-typescript';
import PostData from '../../types/PostData';

@Table
export default class Post extends Model<Post> implements PostData {
  @Column(DataType.INTEGER)
  public author!: number;

  @Column(DataType.STRING)
  public media!: string;

  @Column(DataType.STRING)
  public text!: string;

  @Column(DataType.STRING)
  public expires!: string;

  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUIDV4,
  })
  public id!: string;

  @Column(DataType.STRING)
  public date!: string;
}
