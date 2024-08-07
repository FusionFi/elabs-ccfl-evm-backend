import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  chain: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  symbol: string;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({
    nullable: false,
  })
  decimals: number;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;
}
