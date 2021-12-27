import {
  Table, Model, Column, DataType,
} from 'sequelize-typescript';
import IEdge from '../../types/Edge';

@Table
/**
 * Edge relationship table
 */
export default class Edge extends Model<IEdge> implements IEdge {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column(DataType.STRING)
  public source!: string;

  @Column(DataType.STRING)
  public target!: string;

  @Column(DataType.STRING)
  public type!: 'follow' | 'like';
}
