import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// export enum TokenType {
//   TOKEN = 'token',
//   NATIVE = 'native'
// }

@Entity()
export class Collateral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    // type: 'enum',
    // enum: TokenType
    nullable: false
  })
  type: string;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: false
  })
  chain: string;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;
}
