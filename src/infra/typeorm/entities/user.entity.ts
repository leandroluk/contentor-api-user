import { User } from '$/domain';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TABLE_USER } from '../constants';

@Entity(TABLE_USER)
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  _uid: string;

  @Column({ type: 'timestamptz' })
  _created: Date;

  @Column({ type: 'timestamptz', nullable: true })
  _updated?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  _disabled?: Date;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 100, name: 'display_name' })
  displayName: string;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 1000 })
  password: string;
}
