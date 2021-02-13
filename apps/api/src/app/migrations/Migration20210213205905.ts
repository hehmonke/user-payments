/* eslint-disable prettier/prettier,unicorn/filename-case */
import { Migration } from '@mikro-orm/migrations';

export class Migration20210213205905 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `email` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add unique `user_email_unique`(`email`);');

    this.addSql('create table `account` (`id` int unsigned not null auto_increment primary key, `amount` decimal(10, 2) not null default 0, `user_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `account` add index `account_user_id_index`(`user_id`);');
    this.addSql('alter table `account` add unique `account_user_id_unique`(`user_id`);');

    this.addSql('create table `transaction` (`id` int unsigned not null auto_increment primary key, `payment_id` varchar(255) null default null, `idempotency_key` varchar(255) null default null, `amount` decimal(10, 2) not null default 0, `type` enum(\'transfer\', \'refill\') not null, `from_account_id` int(11) unsigned null default null, `to_account_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `transaction` add unique `transaction_payment_id_unique`(`payment_id`);');
    this.addSql('alter table `transaction` add unique `transaction_idempotency_key_unique`(`idempotency_key`);');
    this.addSql('alter table `transaction` add index `transaction_from_account_id_index`(`from_account_id`);');
    this.addSql('alter table `transaction` add index `transaction_to_account_id_index`(`to_account_id`);');

    this.addSql('alter table `account` add constraint `account_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');

    this.addSql('alter table `transaction` add constraint `transaction_from_account_id_foreign` foreign key (`from_account_id`) references `account` (`id`) on update cascade on delete set null;');
    this.addSql('alter table `transaction` add constraint `transaction_to_account_id_foreign` foreign key (`to_account_id`) references `account` (`id`) on update cascade;');

    this.addSql('insert into `user` (`email`) values (\'test1@test.com\');');
    this.addSql('insert into `account` (`amount`, `user_id`) values (0, 1);');

    this.addSql('insert into `user` (`email`) values (\'test2@test.com\');');
    this.addSql('insert into `account` (`amount`, `user_id`) values (0, 2);');
  }

}
