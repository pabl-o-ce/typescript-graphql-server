import { up } from './server';

up().then(() => console.log(`Running enviroment ${process.env.NODE_ENV}`));
