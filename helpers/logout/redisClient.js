import redis from 'redis';
import 'dotenv/config';

export const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('Redis client connected');
});
redisClient.on('error', error => {
  console.log('Redis not connected', error);
});
