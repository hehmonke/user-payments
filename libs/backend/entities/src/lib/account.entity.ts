import { Entity, IdentifiedReference, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { DecimalType } from '@user-payments/backend/entity-custom-types';

import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryKey()
  id!: number;

  @Property({ type: DecimalType, default: 0 })
  amount!: string;

  @OneToOne(() => User, (e) => e.account, { owner: true, wrappedReference: true })
  user!: IdentifiedReference<User>;
}
