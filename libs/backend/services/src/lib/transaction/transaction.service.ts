import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';

import { Account, Transaction, TransactionType, User } from '@user-payments/backend/entities';

import { Payment, Transfer } from './interfaces';

export class TransactionService {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: EntityRepository<User>,
    @InjectRepository(Transaction)
    private readonly transactionEntityRepository: EntityRepository<Transaction>,
    @InjectRepository(Account)
    private readonly accountEntityRepository: EntityRepository<Account>,
  ) {}

  async payment(data: Payment): Promise<void> {
    if (await this.transactionEntityRepository.findOne({ paymentId: data.paymentId })) {
      throw new ConflictException('Payment has already been processed');
    }

    const user = await this.userEntityRepository.findOneOrFail({ email: data.email }, ['account']);
    const amount = new Decimal(data.amount);

    const transaction = this.transactionEntityRepository.create({
      paymentId: data.paymentId,
      amount: amount.toFixed(2),
      toAccount: user.account,
      type: TransactionType.REFILL,
    });

    this.transactionEntityRepository.persist(transaction);

    const account = user.account.getEntity();
    account.amount = Decimal.add(account.amount, amount).toFixed(2);
  }

  async transfer(data: Transfer, idempotencyKey?: string): Promise<void> {
    if (idempotencyKey && (await this.transactionEntityRepository.findOne({ idempotencyKey }))) {
      throw new ConflictException('Transfer has already been processed');
    }

    const userFrom = await this.userEntityRepository.findOneOrFail(data.userFrom, ['account']);
    const userTo = await this.userEntityRepository.findOneOrFail(data.userTo, ['account']);
    const accountFrom = userFrom.account.getEntity();
    const accountTo = userTo.account.getEntity();
    const amount = new Decimal(data.amount);

    if (amount.lessThanOrEqualTo(0)) {
      throw new BadRequestException('Amount must not be less than 0');
    }

    if (Decimal.sub(accountFrom.amount, amount).lessThan(0)) {
      throw new BadRequestException('Insufficient funds to transfer');
    }

    const transaction = this.transactionEntityRepository.create({
      idempotencyKey,
      amount: amount.toFixed(2),
      fromAccount: userFrom.account,
      toAccount: userTo.account,
      type: TransactionType.TRANSFER,
    });

    this.transactionEntityRepository.persist(transaction);

    accountFrom.amount = Decimal.sub(accountFrom.amount, amount).toFixed(2);
    accountTo.amount = Decimal.add(accountTo.amount, amount).toFixed(2);
  }
}
