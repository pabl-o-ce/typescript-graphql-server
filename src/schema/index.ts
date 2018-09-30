import { makeExecutableSchema } from 'apollo-server';
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

import { DateFormatDirective } from './directives';
import { UserResolver, UserTypeDefs } from './user';

const typeDefs = mergeTypes([
    UserTypeDefs,
], { all: true });
const resolvers = mergeResolvers([
    UserResolver,
]);
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
        date: DateFormatDirective,
    },
});

export { schema };
