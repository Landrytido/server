import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import { LinkGroup } from "@prisma/client";
import LinkGroupRepository from "../../../Repository/LinkGroupRepository";

@Injectable()
export default class GetSortedLinkGroupsWithTotalClicksUseCase
    implements UseCase<Promise<LinkGroup[]>, []> {
    constructor(private readonly linkGroupRepository: LinkGroupRepository) {}

    async handle(context: ContextualGraphqlRequest): Promise<LinkGroup[]> {
        try {
            // Étape 1 : Récupérer les groupes de liens
            const linkGroups = await this.linkGroupRepository.findByUserId(context.userId);

            // Étape 2 : Calculer le total des clics pour chaque groupe
            const linkGroupsWithTotalClicks = linkGroups.map(group => {
                const totalClicks = group.links.reduce((sum, link) => {
                    const linkClicks = link.clicks.reduce((clickSum, click) => clickSum + click.clicks, 0);
                    return sum + linkClicks;
                }, 0);

                return {
                    ...group,
                    totalClicks, // Ajouter la propriété totalClicks pour chaque groupe
                };
            });

            // Étape 3 : Trier les groupes par le total des clics
            const sortedLinkGroups = linkGroupsWithTotalClicks.sort((a, b) => b.totalClicks - a.totalClicks);

            // Étape 4 : Retourner les groupes sans la propriété `totalClicks`
            return sortedLinkGroups.map(({ totalClicks, ...rest }) => rest);
        } catch (error) {
            throw new BadRequestException(
                "Failed to find and sort link groups by user ID",
                error.message
            );
        }
    }
}