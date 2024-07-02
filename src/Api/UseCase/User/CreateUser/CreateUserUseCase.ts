import { BadRequestException, Injectable } from "@nestjs/common";
import SaveUserDto from "../SaveUser/SaveUserDto";
import User from "../../../Entity/User";
import { UncontextualUseCase } from "../../../../index";
import UserRepository from "../../../Repository/UserRepository";

@Injectable()
export default class CreateUserUseCase implements UncontextualUseCase<Promise<User>, [dto: SaveUserDto]> {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async handle(dto: SaveUserDto): Promise<User> {
        try {
            return this.userRepository.saveUser(dto);
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
