import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as config from 'config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UserOperationsModule } from './user-operations/user-operations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => config],
      isGlobal: true,
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   max: 100,
    //   ttl: 0,
    //   store: redisStore,
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get<string>('redisurl'),
        max: 100,
        ttl: 0,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dburl'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    UsersModule,
    UserOperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
