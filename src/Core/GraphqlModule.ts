import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

export default GraphQLModule.forRoot<ApolloDriverConfig>({
  autoSchemaFile: './schema.gql',
  sortSchema: true,
  driver: ApolloDriver,
  playground: process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true',
  buildSchemaOptions: {
    dateScalarMode: 'isoDate'
  },
  installSubscriptionHandlers: true,
  context: async (context) => {
    if (context.req) {
      return context;
    }

    return {
      req: {
        ...context.extra.request,
        headers: {
          ...context.extra.request.headers,
          'authorization': `Bearer ${context.connectionParams.authToken}`
        }
      }
    };
  }
});
