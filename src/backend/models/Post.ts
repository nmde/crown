import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
  @Column(DataType.STRING)
  public media!: string;

  @Column(DataType.STRING)
  public author!: string;

  @Column(DataType.STRING)
  public created!: string;

  @Column(DataType.STRING)
  public expires!: string;

  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;
}
