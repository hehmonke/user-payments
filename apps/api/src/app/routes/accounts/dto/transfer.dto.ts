import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

import { Transfer } from '@user-payments/backend/services';

export class TransferDto implements Transfer {
  @Transform(({ value }) => Number(value))
  @IsInt()
  userFrom!: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  userTo!: number;

  @IsPositive()
  amount!: number;
}
