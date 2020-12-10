import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
  @Column(DataType.STRING)
  public username!: string;
}
