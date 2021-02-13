import { Headers } from '@nestjs/common';

export function IdempotencyKey(): ParameterDecorator {
  return Headers('idempotency-key');
}
