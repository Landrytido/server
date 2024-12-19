// src/Core/Security/Resolver/AuthenticationResolver.ts

import { UseGuards, ForbiddenException } from '@nestjs/common';
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
import LoginWithFacebook from '../UseCase/LoginWithFacebook';
import LoginWithGithub from '../UseCase/LoginWithGithub';
import LoginWithGithubDto from '../Dto/LoginWithGithubDto';
import User from '../../../Api/Entity/User'; // Assurez-vous d'importer le type User
import UserRepository from '../../../Api/Repository/UserRepository';

@Resolver(() => TokenEntity)
export default class AuthenticationResolver {
  constructor(
    private readonly useCaseFactory: AuthenticationUseCaseFactory,
    private readonly userRepository: UserRepository,
  ) {}

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
  async loginWithGoogle(@Args('accessToken') accessToken: string): Promise<string> {
    const loginWithGoogleUseCase = await this.useCaseFactory.create(LoginWithGoogle);
    return loginWithGoogleUseCase.handle(null, accessToken);
  }
  

  @Mutation(() => String)
  async loginWithFacebook(@Args('accessToken') accessToken: string): Promise<string> {
    const loginWithFacebookUseCase = await this.useCaseFactory.create(LoginWithFacebook);
    return loginWithFacebookUseCase.handle(null, accessToken);
  }

  @Mutation(() => String)
  async loginWithGithub(@Args('dto') dto: LoginWithGithubDto): Promise<string> {
    const loginWithGithubUseCase = await this.useCaseFactory.create(LoginWithGithub);
    return loginWithGithubUseCase.handle(null, dto.code);
  }

  // Ajout de la mutation completeProfile
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async completeProfile(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string
  ): Promise<User> {
    // Vérifier que l'utilisateur est authentifié
    if (!context.userId) {
      throw new ForbiddenException('Not authenticated');
    }

    return this.userRepository.save({
      id: context.userId,
      firstName,
      lastName
    });
  }
}
