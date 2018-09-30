import * as dotenv from 'dotenv';
import { Connection, createConnection } from 'typeorm';
import { User } from './schema/user';

dotenv.config();

export async function db (): Promise<Connection> {
  try {
    const connection: Connection = await createConnection({
      name: process.env.DB_NAME,
      type: `mariadb`,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      timezone: process.env.DB_TIMEZONE,
      charset: process.env.DB_CHARSET,
      synchronize: true,
      logging: ['query', 'error'],
      entities: [
        User,
      ],
      subscribers: [
      ],
      cache: {
        type: 'redis',
        options: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        },
      },
    });
    return connection;
  } catch (err) {
    console.log('ErrorDB:');
    console.log(err);
    throw err;
  }
}
