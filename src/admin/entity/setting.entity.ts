import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar',
    unique: true,
  })
  key: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  value: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  type: string;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
