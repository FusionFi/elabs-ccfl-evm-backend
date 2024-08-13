import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Network {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    nullable: false,
    unique: true,
    name: 'chain_id',
  })
  chainId: number;

  @Column({
    nullable: false,
    name: 'tx_url',
  })
  txUrl: string;

  @Column({
    nullable: false,
    name: 'rpc_url',
  })
  rpcUrl: string;

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
