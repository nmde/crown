import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import UserData from '../../types/UserData';

@Table
export default class User extends Model<User> implements UserData {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  public username!: string;

  @Column(DataType.STRING)
  public displayName!: string;

  @Column(DataType.STRING)
  public password!: string;
}
