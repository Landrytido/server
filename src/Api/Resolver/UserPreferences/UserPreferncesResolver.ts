import { UseGuards } from "@nestjs/common";
import { Args, Field, InputType, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "src";
import User from "src/Api/Entity/User";
import UserRepository from "src/Api/Repository/UserRepository";
import { ContextualRequest } from "src/Core/Decorator/ContextualRequest";
import GraphqlAuthGuard from "src/Core/Security/Guard/GraphqlAuthGuard";



@InputType()
export class UserPreferencesInput {
  @Field(() => Boolean, { nullable: true })
  deleteSharedNotesOnRelationEnd?: boolean;
}

@Resolver(User)
export class UserPreferencesResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Query(() => User)
  @UseGuards(GraphqlAuthGuard)
  async getUserPreferences(@ContextualRequest() context: ContextualGraphqlRequest) {
    return this.userRepository.findById(context.userId);
  }

  @Mutation(() => User)
  @UseGuards(GraphqlAuthGuard)
  async updateUserPreferences(
    @ContextualRequest() context: ContextualGraphqlRequest,
    @Args('preferences') preferences: UserPreferencesInput
  ) {
    return this.userRepository.update(context.userId, preferences);
  }
}