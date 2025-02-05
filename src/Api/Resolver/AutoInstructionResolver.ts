import { Resolver, Mutation, Query, Args, Int } from "@nestjs/graphql";
import { AutoInstructionRepository } from "../Repository/AutoInstructionRepositorty";
import {
  AutoInstructionInput,
  CreateAutoInstructionInput,
} from "../Dto/CreateAutoInstructionDto";
import { UpdateAutoInstructionInput } from "../Dto/UpdateAutoInstructionDto";
import { AutoInstruction } from "../Entity/AutoInstruction";

@Resolver(() => AutoInstruction)
export class AutoInstructionResolver {
  constructor(
    private readonly autoInstructionRepository: AutoInstructionRepository,
  ) {}

  @Mutation(() => AutoInstruction)
  async addAutoInstruction(
    @Args("createAutoInstructionInput")
    createAutoInstructionInput: CreateAutoInstructionInput
  ) {
    return this.autoInstructionRepository.create(createAutoInstructionInput);
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

  @Query(() => [AutoInstruction])
  async getAutoInstructions(@Args("userId") userId: number) {
    return this.autoInstructionRepository.findAll(userId);
  }

  @Mutation(() => [AutoInstruction])
  async reorderInstructions(
    @Args("userId") userId: number,
    @Args("instructions", { type: () => [AutoInstructionInput] })
    instructions: AutoInstructionInput[]
  ): Promise<AutoInstruction[]> {
    return this.autoInstructionRepository.orderAutoInstruction(
      userId,
      instructions
    );
  }
}
