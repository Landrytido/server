import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ContextualGraphqlRequest } from '../../index';

export const ContextualRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): ContextualGraphqlRequest => {
    const request = GqlExecutionContext.create(context).getContext().req;

    const headers = {
      ...request.headers
    };

    delete headers.authorization;

    return { ...request.user, request: { headers }  };
  }
);
