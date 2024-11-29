import {
    BadRequestException,
    Injectable,
} from "@nestjs/common";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import LinkClickRepository from "../../../Repository/LinkClickRepository";

@Injectable()
export default class DeleteAllLinkClicksUseCase
    implements UseCase<Promise<boolean>, []>
{
    constructor(private readonly linkClickRepository: LinkClickRepository) {}

    async handle(context: ContextualGraphqlRequest) {
        try {
            await this.linkClickRepository.deleteAllLinkClick();
            return true;
        } catch (error) {
            throw new BadRequestException(
                "Failed to delete all link clicks",
                error.message
            );
        }
    }
}
