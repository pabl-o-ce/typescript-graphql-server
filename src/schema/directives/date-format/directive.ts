import { defaultFieldResolver, GraphQLField, GraphQLString } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import * as moment from 'moment';
import 'moment-timezone';

export class DateFormatDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition (field) {
        const { resolve = defaultFieldResolver } = field;
        const { defaultFormat } = this.args;

        field.args.push({
            name: 'format',
            type: GraphQLString,
        });

        field.resolve = async (source, { format, ...otherArgs }, context, info) => {
            const date = await resolve.call(this, source, otherArgs, context, info);

            return moment(date).tz('America/Guayaquil').format(`${(format) ? format : defaultFormat}`);
        };

        field.type = GraphQLString;
    }
  }
