// src/Core/Security/Resolver/AuthenticationResolver.ts

import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { ContextualGraphqlRequest } from '../../../index';
import { ContextualRequest } from '../../Decorator/ContextualRequest';
import AuthenticationDto from '../Dto/AuthenticationDto';
import TokenValidationDto from '../Dto/TokenValidationDto';
import TokenEntity from '../Entity/TokenEntity';
import GraphqlAuthGuard from '../Guard/GraphqlAuthGuard';
import AuthenticationUseCaseFactory from '../UseCase/AuthenticationUseCaseFactory';
import Login from '../UseCase/Login';
import RefreshToken from '../UseCase/RefreshToken';
import ValidateToken from '../UseCase/ValidateToken';
import LoginWithGoogle from '../UseCase/LoginWithGoogle';

@Resolver(() => TokenEntity)
export default class AuthenticationResolver {
  constructor(private readonly useCaseFactory: AuthenticationUseCaseFactory) {}

  @Query(() => String)
  async login(@Args('dto') dto: AuthenticationDto): Promise<string> {
    const loginUseCase = await this.useCaseFactory.create(Login);
    return loginUseCase.handle(null, dto);
  }

  @Query(() => Boolean)
  async validateToken(@Args('dto') dto: TokenValidationDto): Promise<boolean> {
    const validateTokenUseCase = await this.useCaseFactory.create(ValidateToken);
    return validateTokenUseCase.handle(null, dto);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => String)
  async refreshToken(@ContextualRequest() context: ContextualGraphqlRequest): Promise<string> {
    const refreshTokenUseCase = await this.useCaseFactory.create(RefreshToken);
    return refreshTokenUseCase.handle(context);
  }

  @Mutation(() => String)
  async loginWithGoogle(@Args('idToken') idToken: string): Promise<string> {
    const loginWithGoogleUseCase = await this.useCaseFactory.create(LoginWithGoogle);
    return loginWithGoogleUseCase.handle(null, idToken);
  }
}
