import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CardanoLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
    name: 'loan_token_name',
  })
  loanTokenName: string;

  @Column({
    nullable: false,
    name: 'oracle_token_name',
  })
  oracleTokenName: string;

  @Column({
    nullable: false,
    name: 'loan_value',
  })
  loanValue: number;

  @Column({
    nullable: false,
    name: 'user_pkh',
  })
  userPkh: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
