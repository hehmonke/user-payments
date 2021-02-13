import { EntityManager } from '@mikro-orm/core';
import { Body, Controller, Post } from '@nestjs/common';

import { TransactionService } from '@user-payments/backend/services';

import { IdempotencyKey } from '../../decorators/idempotency-key.decorator';

import { PaymentDto } from './dto/payment.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly em: EntityManager, private readonly transactionService: TransactionService) {}

  @Post('payment')
  async createPayment(@Body() data: PaymentDto): Promise<void> {
    await this.transactionService.payment(data);
    await this.em.flush();
  }

  @Post('transfer')
  async createTransfer(@Body() data: TransferDto, @IdempotencyKey() idempotencyKey?: string): Promise<void> {
    await this.transactionService.transfer(data, idempotencyKey);
    await this.em.flush();
  }
}
