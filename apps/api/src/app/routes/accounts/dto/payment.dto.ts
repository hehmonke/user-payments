import { IsEmail, IsNumber, IsString } from 'class-validator';

import { Payment } from '@user-payments/backend/services';

export class PaymentDto implements Payment {
  @IsString()
  paymentId!: string;

  @IsEmail()
  email!: string;

  @IsNumber()
  amount!: number;
}
