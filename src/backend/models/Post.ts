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
    primaryKey: true,
    type: DataType.STRING,
  })
  public id!: string;

  @Column(DataType.STRING)
  public date!: string;
}
