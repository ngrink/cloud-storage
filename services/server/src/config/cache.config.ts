import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

export const CacheOptions: CacheModuleAsyncOptions<RedisClientOptions> = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    store: redisStore,
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    database: configService.get('REDIS_DATABASE'),
    username: configService.get('REDIS_USERNAME'),
    password: configService.get('REDIS_PASSWORD'),
    ttl: Number(configService.get('REDIS_TTL')),
    max: Number(configService.get('REDIS_MAX')),
  }),
};
