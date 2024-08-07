import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Collateral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  type: string;

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
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  decimals: number;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;
}
