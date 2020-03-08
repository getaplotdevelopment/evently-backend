import redis from 'redis';
import { exec } from 'child_process';

if (process.env.NODE_ENV === 'development') {
  const puts = (error, stdout) => {
    console.log(error);
    console.log(stdout);
  };
  //   exec('redis/src/redis-server redis/redis.conf', puts);

  //   /usr/bin/redis-server /etc/redis/redis.conf
}

export const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('Redis client connected');
});
redisClient.on('error', error => {
  console.log('Redis not connected', error);
});
