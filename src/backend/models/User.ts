import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IUser from '../../types/User';

@Table
export default class User extends Model<User> implements IUser {
  @Column(DataType.STRING)
  public username!: string;

  @Column(DataType.STRING)
  public password!: string;

  @Column(DataType.STRING)
  public email!: string;

  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;

  @Column(DataType.INTEGER)
  public lastTokenReset!: number;
}
