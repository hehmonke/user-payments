import { Module } from '@nestjs/common';

import { TransactionModule } from '@user-payments/backend/services';

import { AccountsController } from './accounts.controller';

@Module({
  imports: [TransactionModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
