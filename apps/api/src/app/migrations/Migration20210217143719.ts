/* eslint-disable prettier/prettier,unicorn/filename-case */
import { Migration } from '@mikro-orm/migrations';

export class Migration20210217143719 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `account` add `version` int(11) not null default 1;');
  }

}
