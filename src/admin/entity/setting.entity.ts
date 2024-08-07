import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'varchar'
  })
  key: string;

  @Column({
    nullable: false,
    type: 'text'
  })
  value: string;

  @Column({
    nullable: false,
    type: 'varchar'
  })
  type: string;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;
}
