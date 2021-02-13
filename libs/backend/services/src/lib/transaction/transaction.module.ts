import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Account, Transaction, User } from '@user-payments/backend/entities';

import { TransactionService } from './transaction.service';

@Module({
  imports: [MikroOrmModule.forFeature([Account, Transaction, User])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
