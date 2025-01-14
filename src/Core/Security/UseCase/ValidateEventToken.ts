import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import Authenticator from "../Service/authentication/Authenticator";
import RequestEventEmitter from "src/Core/Event/Emitter/RequestEventEmitter";
import MeetingRepository from "src/Api/Repository/MeetingRepository";
import { ContextualGraphqlRequest, UseCase } from "src";
import TokenValidationDto from "../Dto/TokenValidationDto";
import { ValidateEventTokenResponse } from "../Entity/ValidateEventTokenResponseEntity";

@Injectable()
export default class ValidateEventToken
  implements
    UseCase<Promise<ValidateEventTokenResponse>, [dto: TokenValidationDto]>
{
  constructor(
    @Inject("Authenticator") private authenticator: Authenticator,
    private readonly eventEmitter: RequestEventEmitter,
    private readonly meetingRepository: MeetingRepository
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: TokenValidationDto) {
    try {
      await this.authenticator.validate(dto.token);

      const meeting = await this.meetingRepository.findByToken(dto.token);
      console.log("validateEventToken", meeting); //a supp

      if (!meeting) {
        this.eventEmitter.emit("validate_token_failed", {
          context,
          dto,
          error: "Invalid token or no associated event",
        });
        return { isValid: false };
      }

      this.eventEmitter.emit("validate_token_successfully", { context, dto });

      return { isValid: true, eventId: meeting.id };
    } catch (error) {
      this.eventEmitter.emit("validate_token_failed", {
        context,
        dto,
        error: error.message,
      });

      throw new BadRequestException(error.message);
    }
  }
}
