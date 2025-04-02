import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Label } from '../Entity/Label';
import UseCaseFactory from '../UseCase/UseCaseFactory';
import GetAllLabelsUseCase from '../UseCase/Label/getAllLabelsUseCase';
import GetLabelByIdUseCase from '../UseCase/Label/getLabelByIdUseCase';
import { ContextualRequest } from 'src/Core/Decorator/ContextualRequest';
import { ContextualGraphqlRequest } from 'src';
import { UseGuards } from '@nestjs/common';
import GraphqlAuthGuard from 'src/Core/Security/Guard/GraphqlAuthGuard';
import { CreateLabelInput } from '../Dto/label/createLabelDto';
import { GetLabelByIdInput } from '../Dto/label/getLabelByIdDto';
import CreateLabelUseCase from "../UseCase/Label/createLabelUsecase";

@Resolver(() => Label)
@UseGuards(GraphqlAuthGuard)
export class LabelResolver {
    constructor(private readonly useCaseFactory: UseCaseFactory) {}

    @Mutation(() => Label, { name: 'createLabel' })
    async createLabel(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('dto') dto:CreateLabelInput
    ): Promise<Label> {
        return (await this.useCaseFactory.create(CreateLabelUseCase)).handle(context, dto.name);
         }

    @Query(() => [Label], { name: 'getAllLabels' })
    async getAllLabels(@ContextualRequest() context: ContextualGraphqlRequest): Promise<Label[]> {
        return (await this.useCaseFactory.create(GetAllLabelsUseCase)).handle(context);
    }

    @Query(() => Label, { name: 'getLabelById', nullable: true })
    async getLabelById(
        @ContextualRequest() context: ContextualGraphqlRequest,
        @Args('dto') dto : GetLabelByIdInput
    ): Promise<Label | null> {
        return (await this.useCaseFactory.create(GetLabelByIdUseCase)).handle(context, dto.id);
    }
}
