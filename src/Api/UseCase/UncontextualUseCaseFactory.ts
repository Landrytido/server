import { Injectable } from '@nestjs/common';
import ServiceFactoryUncontextualUseCase from "../../Core/Factory/ServiceFactoryUncontextualUseCase";
import CreateUserUseCase from "./User/CreateUser/CreateUserUseCase";

type UncontextualUseCases = CreateUserUseCase;

@Injectable()
export default class UncontextualUseCaseFactory extends ServiceFactoryUncontextualUseCase<UncontextualUseCases> {}
