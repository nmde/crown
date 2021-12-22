import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IUser from '../../types/User';

type ExtendedUser = IUser & {
  password: string;
};

@Table
/**
 * User table
 */
export default class User extends Model<ExtendedUser> implements ExtendedUser {
  @Column(DataType.STRING)
  public username!: string;

  @Column(DataType.STRING)
  public password!: string;

  @Column(DataType.STRING)
  public email!: string;

  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  declare public id: string;

  @Column(DataType.INTEGER)
  public lastTokenReset!: number;

  @Column(DataType.STRING)
  public displayName!: string;

  @Column(DataType.STRING)
  public profileBackground!: string;

  @Column(DataType.STRING)
  public profilePicture!: string;

  @Column(DataType.INTEGER)
  public boostBalance!: number;
}
