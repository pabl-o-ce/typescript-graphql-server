import { ApolloServer, ServerInfo } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled, ApolloServerPluginCacheControl } from 'apollo-server-core';
import { bold, blueBright, greenBright, magentaBright, underline, yellowBright } from 'chalk';
import { config } from 'dotenv';
import { Connection } from 'typeorm';

import { db } from './db';
import { schema } from './schema';
//import { authCliente } from './auth';
import { textSync } from 'figlet';

config();

export async function up (): Promise<void> {
  try {
    // Starting Application Server
    const database: Connection = await db();
    const server: ApolloServer = new ApolloServer({
      schema,
      context: async ({ req }) => {
        let usr;
        const token = req.headers.authorization || '';
        try {
          // usr = await authCliente(token, database);
        } catch (error) {
          throw error;
        } finally {
          return {
            db: database,
            user: (usr) ? usr : null
          };
        } 
      },
      debug: (process.env.DEBUG === 'true'),
      plugins: [
        process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageDisabled() : ApolloServerPluginLandingPageGraphQLPlayground({
          settings: {
            'editor.cursorShape': 'line',
            'editor.theme': 'dark',
            'tracing.hideTracingResponse': false,
        }}),
        ApolloServerPluginCacheControl({
          defaultMaxAge: 2000,
          calculateHttpHeaders: true,
        }),
      ],
    });
    const info: ServerInfo = await server.listen({
      port: process.env.PORT,
    });
    console.log(`${yellowBright('')} ${bold.greenBright('')}`);
    console.log(`${yellowBright('')} ${bold.greenBright('')}`);
    console.log(`${yellowBright('')} ${bold.blueBright('')} ${yellowBright('')}${bold.greenBright('')}`);
    console.log(`${bold.greenBright('                                  ')}`);
    console.log(magentaBright(textSync('POSCYE', 'Small Shadow')));
    console.log(`${yellowBright('')} ${bold.blueBright('')} ${yellowBright('')}${bold.greenBright('')}`);
    console.log(`${yellowBright('')} ${bold.greenBright('')}`);
    console.log(`${yellowBright('')} ${bold.greenBright('')}`);
    console.log(blueBright('⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶'));
    console.log(`${bold.greenBright(' Server:           ')}${underline.blueBright(info.url.slice(0, -1))}`);
    console.log(`${bold.greenBright(' Database:         ')}${bold.blueBright(database.name)}`);
    console.log(`${greenBright.bold(' Enviroment:      ')} ${bold.blueBright(process.env.NODE_ENV)}`)
  } catch (err) {
    console.log(bold.red('ERROR'));
    throw err;
  }
}


/// @#YD$2euRsN%S2?T