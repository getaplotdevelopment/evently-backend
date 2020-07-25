import redis from 'redis';
import 'dotenv/config';

export const redisClient = redis.createClient(process.env.REDIS_URL, {
  no_ready_check: true
});
redisClient.on('connect', () => {
  console.log('Redis client connected');
});
redisClient.on('error', error => {
  console.log('Redis not connected', error);
});