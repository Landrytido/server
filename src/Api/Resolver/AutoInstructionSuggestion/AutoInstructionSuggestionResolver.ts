import {Resolver, Query, Args, Int} from "@nestjs/graphql";
import {AutoInstructionSuggestion} from "../../Entity/AutoInstructionSuggestion/AutoInstructionSuggestion";
import UseCaseFactory from "../../UseCase/UseCaseFactory";
import GetAllAutoInstructionSuggestionUseCase
    from "../../UseCase/AutoInstructionSuggestion/GetAllAutoInstructionSuggestion/GetAllAutoInstructionSuggestionUseCase";
import GetAutoInstructionSuggestionUseCase
    from "../../UseCase/AutoInstructionSuggestion/GetAutoInstructionSuggestion/GetAutoInstructionSuggestionUseCase";
import {ContextualRequest} from "../../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest as CtxRequest} from "../../../index";
import {UseGuards} from "@nestjs/common";
import GraphqlAuthGuard from "../../../Core/Security/Guard/GraphqlAuthGuard";

@Resolver(() => AutoInstructionSuggestion)
export class AutoInstructionSuggestionResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {
    }

    @UseGuards(GraphqlAuthGuard)
    @Query(() => [AutoInstructionSuggestion])
    async getAutoInstructionSuggestions(
	    @ContextualRequest() context: CtxRequest,
    ) {
	  return (await this.useCaseFactory.create(GetAllAutoInstructionSuggestionUseCase)).handle(context);
    }

    @UseGuards(GraphqlAuthGuard)
    @Query(() => AutoInstructionSuggestion)
    async getAutoInstructionSuggestionById(
	    @ContextualRequest() context: CtxRequest,
	    @Args('id', { type: () => Int }) id: number,
    ) {
	  return (await this.useCaseFactory.create(GetAutoInstructionSuggestionUseCase)).handle(context, id);
    }
}
