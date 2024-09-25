import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Subscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    name: 'first_subscribed_at',
  })
  firstSubscribedAt: Date;

  @Column({
    nullable: true,
    name: 'last_subscribed_at',
  })
  lastSubscribedAt: Date;

  @Column({
    default: 0,
    name: 'num_subscribed',
    type: 'int',
  })
  numSubscribed: number;

  @Column({
    nullable: true,
    name: 'first_unsubscribed_at',
  })
  firstUnsubscribedAt: Date;

  @Column({
    nullable: true,
    name: 'last_unsubscribed_at',
  })
  lastUnsubscribedAt: Date;

  @Column({
    default: 0,
    name: 'num_unsubscribed',
    type: 'int',
  })
  numUnsubscribed: number;

  @Column({
    default: false,
    name: 'is_subscribed',
  })
  isSubscribed: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
