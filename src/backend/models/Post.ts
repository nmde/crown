import {
  Model, Table, Column, DataType,
} from 'sequelize-typescript';
import PostData from '../../types/PostData';

@Table
export default class Post extends Model<Post> implements PostData {
  @Column({
    type: DataType.INTEGER,
  })
  author!: number;

  @Column({
    type: DataType.STRING,
  })
  media!: string;

  @Column({
    type: DataType.STRING,
  })
  text!: string;

  @Column({
    type: DataType.DATE,
  })
  expires!: string;

  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUIDV4,
  })
  id!: string;
}
