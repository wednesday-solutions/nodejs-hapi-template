import CatboxRedis from '@hapi/catbox-redis';

export const redisCacheType = {
    cache: 'redis',
    expiresIn: 1000 * 60 * 60 * 24 * 30, // 1 month = seconds * minutes * hours * days
    generateTimeout: 2000
};

export const redisCache = {
    name: 'redis',
    provider: {
        constructor: CatboxRedis,
        options: {
            partition: 'temp_dev_data',
            host: process.env.REDIS_HOST,
            port: 6379
        }
    }
};
