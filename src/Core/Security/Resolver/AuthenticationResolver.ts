import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { ContextualGraphqlRequest } from '../../../index';
import { ContextualRequest } from '../../Decorator/ContextualRequest';
import { Roles } from '../Decorator/RolesDecorator';
import AuthenticationDto from '../Dto/AuthenticationDto';
import TokenValidationDto from '../Dto/TokenValidationDto';
import TokenEntity from '../Entity/TokenEntity';
import GraphqlAuthGuard from '../Guard/GraphqlAuthGuard';
import { RolesGuard } from '../Guard/RolesGuard';
import AuthenticationUseCaseFactory from '../UseCase/AuthenticationUseCaseFactory';
import Login from '../UseCase/Login';
import RefreshToken from '../UseCase/RefreshToken';
import ValidateToken from '../UseCase/ValidateToken';

@Resolver(() => TokenEntity)
export default class AuthenticationResolver {
  constructor(private readonly useCaseFactory: AuthenticationUseCaseFactory) {}

  @Query(() => String)
  async login(@Args('dto') dto: AuthenticationDto) {
    return (await this.useCaseFactory.create(Login)).handle(null, dto);
  }

  @Query(() => Boolean)
  async validateToken(@Args('dto') dto: TokenValidationDto) {
    return (await this.useCaseFactory.create(ValidateToken)).handle(null, dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => String)
  async refreshToken(@ContextualRequest() context: ContextualGraphqlRequest) {
    return (await this.useCaseFactory.create(RefreshToken)).handle(context);
  }
}
