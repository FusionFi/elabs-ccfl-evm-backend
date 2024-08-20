import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['chainId', 'symbol', 'address'])
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  category: string;

  @Column({
    nullable: false,
  })
  type: string;

  @Column({
    nullable: false,
    name: 'chain_name',
  })
  chainName: string;

  @Column({
    nullable: false,
    name: 'chain_id',
  })
  chainId: number;

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
    nullable: false,
    name: 'coingecko_id',
  })
  coingeckoId: string;

  @Column({
    default: 0,
    type: 'numeric',
    precision: 20,
    scale: 10
  })
  price: number;

  @Column({
    default: true,
    name: 'is_mainnet',
  })
  isMainnet: boolean;

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
