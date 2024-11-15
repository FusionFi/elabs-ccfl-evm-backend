import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class FiatLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    name: 'user_encryptus_id',
  })
  userEncryptusId: string;

  @Column({
    nullable: false,
    name: 'user_wallet_address',
  })
  userWalletAddress: string;

  @Column({
    nullable: false,
    name: 'network_id',
    type: 'int',
  })
  networkId: number;

  @Column({
    nullable: true,
    name: 'tx_hash',
    default: null,
  })
  txHash: string;

  @Column({
    nullable: false,
    name: 'payout_method',
  })
  payoutMethod: string;

  @Column({
    nullable: false,
  })
  country: string;

  @Column({
    nullable: false,
  })
  currency: string;

  @Column({
    nullable: false,
  })
  amount: string;

  @Column({
    nullable: false,
    name: 'repayment_token',
  })
  repaymentToken: string;

  @Column({
    nullable: false,
    type: 'json',
    name: 'payout_detail',
  })
  payoutDetail: Record<string, any>;

  @Column({
    nullable: false,
    default: false,
    name: 'is_receive_email',
  })
  isReceiveEmail: boolean;

  @Column({
    nullable: false,
    default: 'UNPROCESSED',
  })
  status: string;

  @Column({
    nullable: true,
    name: 'quote_id',
  })
  quoteId: string;

  @Column({
    nullable: true,
    name: 'encryptus_order_id',
  })
  encryptusOrderId: string;

  @Column({
    nullable: true,
    name: 'coin_quantity_charged',
  })
  coinQuantityCharged: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
