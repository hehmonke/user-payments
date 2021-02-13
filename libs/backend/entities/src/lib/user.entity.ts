import { Entity, IdentifiedReference, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';

import { Account } from './account.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property()
  email!: string;

  @OneToOne(() => Account, (e) => e.user, { wrappedReference: true })
  account!: IdentifiedReference<Account>;
}
