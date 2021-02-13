import { Entity, Enum, IdentifiedReference, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';

import { DecimalType, VarcharType } from '@user-payments/backend/entity-custom-types';

import { Account } from './account.entity';

export enum TransactionType {
  TRANSFER = 'transfer',
  REFILL = 'refill',
}

@Entity()
export class Transaction {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property({ type: VarcharType, nullable: true, default: null })
  paymentId!: string | null;

  @Unique()
  @Property({ type: VarcharType, nullable: true, default: null })
  idempotencyKey!: string;

  @Property({ type: DecimalType, default: 0 })
  amount!: string;

  @Enum({ items: () => TransactionType })
  type!: TransactionType;

  @ManyToOne(() => Account, { wrappedReference: true, nullable: true, default: null })
  fromAccount!: IdentifiedReference<Account>;

  @ManyToOne(() => Account, { wrappedReference: true })
  toAccount!: IdentifiedReference<Account>;
}
