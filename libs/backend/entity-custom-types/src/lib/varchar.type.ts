import { EntityProperty, Platform, Type } from '@mikro-orm/core';

type JSType = string | null;
type DBType = JSType;

export class VarcharType extends Type<JSType, DBType> {
  constructor(private readonly length = 255) {
    super();
  }

  getColumnType(property: EntityProperty, platform: Platform): string {
    return `varchar(${this.length})`;
  }
}
