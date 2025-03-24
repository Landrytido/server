import {Resolver, Mutation, Query, Args} from "@nestjs/graphql";
import {AutoInstructionRepository} from "../Repository/AutoInstructionRepositorty";
import {
    AutoInstructionInput,
    CreateAutoInstructionInput,
} from "../Dto/CreateAutoInstructionDto";
import {UpdateAutoInstructionInput} from "../Dto/UpdateAutoInstructionDto";
import {AutoInstruction} from "../Entity/AutoInstruction";
import {ContextualRequest} from "../../Core/Decorator/ContextualRequest";
import {ContextualGraphqlRequest} from "../../index";
import {UseGuards} from "@nestjs/common";
import GraphqlAuthGuard from "../../Core/Security/Guard/GraphqlAuthGuard";

@Resolver(() => AutoInstruction)
export class AutoInstructionResolver {
    constructor(
        private readonly autoInstructionRepository: AutoInstructionRepository,
    ) {
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => AutoInstruction)
    async addAutoInstruction(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args("createAutoInstructionInput")
        createAutoInstructionInput: CreateAutoInstructionInput
    ) {
        return this.autoInstructionRepository.create(createAutoInstructionInput, context.userId);
    }

    @Mutation(() => AutoInstruction)
    async removeAutoInstruction(@Args("id") id: number) {
        return this.autoInstructionRepository.remove(id);
    }

    @Mutation(() => AutoInstruction)
    async updateAutoInstruction(
        @Args("updateAutoInstructionInput")
        updateAutoInstructionInput: UpdateAutoInstructionInput
    ) {
        return this.autoInstructionRepository.update(updateAutoInstructionInput);
    }

    @UseGuards(GraphqlAuthGuard)
    @Query(() => [AutoInstruction])
    async getAutoInstructions(
        @ContextualRequest() context: ContextualGraphqlRequest,
    ) {
        return this.autoInstructionRepository.findAll(context.userId);
    }

    @Mutation(() => [AutoInstruction])
    async reorderInstructions(
        @Args("userId") userId: number,
        @Args("instructions", {type: () => [AutoInstructionInput]})
        instructions: AutoInstructionInput[]
    ): Promise<AutoInstruction[]> {
        return this.autoInstructionRepository.orderAutoInstruction(
            userId,
            instructions
        );
    }
}
