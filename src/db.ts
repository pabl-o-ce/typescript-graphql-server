import { config } from 'dotenv';
import { red } from 'chalk';
import { Connection, createConnection } from 'typeorm';

config();

export async function db (): Promise<Connection> {
  try {
    const connection: Connection = await createConnection({
      name: process.env.DB_NAME,
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [],
      subscribers: [],
      pool: { max: 10, min: 0, idleTimeoutMillis: 10000 },
      synchronize: false,
      logging: ['query', 'error'],
      options: { encrypt: false, debug: { data: (process.env.DEBUG === 'true'), payload: (process.env.DEBUG === 'true')  } },
    });
    return connection;
  } catch (err) {
    console.log(`${red('DB ERROR')}`);
    throw err;
  }
}
