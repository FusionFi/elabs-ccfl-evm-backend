import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Fiat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  currency: string;

  @Column({
    nullable: true,
  })
  price: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
