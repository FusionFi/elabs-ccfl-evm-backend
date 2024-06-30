import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    nullable: false
  })
  password: string;

  @Column({
    nullable: false,
    name: 'first_name'
  })
  firstName: string;

  @Column({
    nullable: false,
    name: 'last_name'
  })
  lastName: string;

  @Column({
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    default: false,
    name: 'email_verified'
  })
  emailVerified: boolean;

  @Column({
    default: 'user'
  })
  role: string;

  @Column({
    default: true,
    name: 'is_active'
  })
  isActive: boolean;
}
