import { LoadStrategy, MikroORM, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Account, Transaction, User } from '@user-payments/backend/entities';

import * as migrations from './migrations';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [Account, Transaction, User],
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number.parseInt(configService.get('DB_PORT') || '3306', 10),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        dbName: configService.get('DB_NAME'),
        debug: configService.get('DB_LOGGER') === 'true' ? ['query', 'query-params'] : [],
        logger: (message) => new Logger('MikroORM').log(message),
        findOneOrFailHandler: (entityName) => new NotFoundException(`${entityName} not found`),
        namingStrategy: UnderscoreNamingStrategy,
        discovery: {
          disableDynamicFileAccess: true,
        },
        migrations: {
          migrationsList: Object.entries(migrations).flatMap((value) => ({ name: value[0], class: value[1] })),
        },
        loadStrategy: LoadStrategy.JOINED,
      }),
    }),
    RoutesModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService, private readonly mikroORM: MikroORM) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get('DB_MIGRATE') === 'true') {
      await this.mikroORM.getMigrator().up();
    }

    if (process.env.NODE_ENV === 'development' && this.configService.get('DB_SYNC') === 'true') {
      await this.mikroORM.getSchemaGenerator().updateSchema();
    }
  }
}
