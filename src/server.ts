import { ApolloServer, ServerInfo } from 'apollo-server';
import { RedisCache } from 'apollo-server-cache-redis';
import { Connection } from 'typeorm';

import * as dotenv from 'dotenv';

import { db } from './db';
import { schema } from './schema';

dotenv.config();

export async function up (): Promise<void> {
  try {
    const database: Connection = await db();
    // Starting Application Server
    const server: ApolloServer = new ApolloServer({
      schema,
      context: () => ({
        db: database,
      }),
      playground: {
        settings: {
          'editor.cursorShape': 'line',
          'editor.fontFamily': `-apple-system, BlinkMacSystemFont, 'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'editor.theme': 'dark',
          'tracing.hideTracingResponse': false,
        },
      },
      tracing: true,
      cacheControl: {
        calculateHttpHeaders: true,
        stripFormattedExtensions: true,
      },
      engine: {
        apiKey: process.env.ENGINE_API_KEY,
      },
      persistedQueries: {
        cache: new RedisCache({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
      },
    });
    const info: ServerInfo = await server.listen({ port: 3000 });

    console.log(`🚀 Server: ${info.url.slice(0, -1)}`);
    console.log(`🌋 Graphql: ${info.url.slice(0, -1)}${info.subscriptionsPath}`);
    console.log(`⚡️ Subscriptions: ${info.subscriptionsUrl}`);
    console.log(`☁️ Database: ${database.name}`);
  } catch (err) {
    console.log(`💩 Error: 💩💩💩`);
    throw err;
  }
}
