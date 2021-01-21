import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';

@Table
export default class Post extends Model<Post> {
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
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;
}
