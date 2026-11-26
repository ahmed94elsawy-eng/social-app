// implementation
import Redis from "ioredis";
import {ICacheProvider} from "./cache.interface";

interface RedisConfig {
    host: string;
    port: number;
    password: string;
}

export class RedisCacheProvider implements ICacheProvider{
    public client: Redis;

    constructor(config: RedisConfig) {
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3
        });
        // for any error caused in redis cache server
        this.client.on('error', (err) => {
            console.log('[RedisCacheProvider] RedisCacheProvider Error: ', err.message);
        });
        // for errors in case connect function
        this.client.connect().catch(err => console.log('fail to connect to redis'));
    }

    async set(key: string, value: string, ttl: number) {
        return this.client.set(key, value, 'EX', ttl);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async del(key: string) {
        return this.client.del(key);
    }


    async ttl(key: string) {
        return this.client.ttl(key);
    }
}