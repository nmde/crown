import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IMedia from '../../types/Media';

@Table
/**
 * Media table
 */
export default class Media extends Model<IMedia> implements IMedia {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  declare public id: string;

  @Column(DataType.TEXT)
  public data!: string;

  @Column(DataType.STRING)
  public mimeType!: string;
}
