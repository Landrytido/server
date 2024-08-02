import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import { LinkGroup } from "../../../Entity/LinkGroup";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import CreateLinkGroupDto from "../CreateLinkGroup/CreateLinkGroupDto";
import InsufficientPermissionException from "../../../../Core/Exception/InsufficientPermissionException";

@Injectable()
export default class UpdateLinkGroupUseCase implements UseCase<Promise<LinkGroup>, [LinkGroupId: number, dto: CreateLinkGroupDto]> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context:ContextualGraphqlRequest,  linkGroupId: number, dto: CreateLinkGroupDto): Promise<LinkGroup> {
        try {
            const linkGroup = await this.linkGroupRepository.findById(linkGroupId);

            if (!linkGroup) throw new NotFoundException("Link group does not exist");

            if (linkGroup.userId !== context.userId)
                throw new InsufficientPermissionException("You do not have permission to access or modify this link group.");

            return await this.linkGroupRepository.save(context.userId, {
                id: linkGroupId,
                ...dto
            });
        } catch (error) {
            throw new BadRequestException('Failed to update link group', error.message);
        }
    }
}