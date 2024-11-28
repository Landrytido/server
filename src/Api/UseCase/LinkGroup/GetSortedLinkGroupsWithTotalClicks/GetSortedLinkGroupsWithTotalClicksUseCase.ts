import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";
import {LinkGroup} from "@prisma/client";

@Injectable()
export default class GetSortedLinkGroupsWithTotalClicksUseCase
    implements UseCase<Promise<LinkGroup[]>, []> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]> {
        try {
            const linkGroups = await this.linkGroupRepository.findByUserId(context.userId);

            const linkGroupsWithTotalClicks = linkGroups.map(group => {
                const totalClicks = group.links.reduce((sum, link) => {
                    const linkClicks = link.clicks.reduce((clickSum, click) => clickSum + click.clicks, 0);
                    return sum + linkClicks;
                }, 0);

                return {
                    ...group,
                    totalClicks,
                };
            });

            const sortedLinkGroups = linkGroupsWithTotalClicks.sort((a, b) => b.totalClicks - a.totalClicks);

            return sortedLinkGroups.map(({ totalClicks, ...rest }) => rest);
        } catch (error) {
            throw new BadRequestException(
                "Failed to find and sort link groups by user ID",
                error.message
            );
        }
    }
}
