import { EntityProperty, Platform, Type } from '@mikro-orm/core';

type JSType = string | null;
type DBType = JSType;

export class DecimalType extends Type<JSType, DBType> {
  constructor(private readonly length = 10, private readonly decimals = 2) {
    super();
  }

  getColumnType(property: EntityProperty, platform: Platform): string {
    return `decimal(${this.length}, ${this.decimals})`;
  }
}
