import { Injectable } from "@nestjs/common";
import ServiceFactory from "../../Factory/ServiceFactory";
import Login from "./Login";
import RefreshToken from "./RefreshToken";
import ValidateToken from "./ValidateToken";
import LoginWithGoogle from "./LoginWithGoogle";
import LoginWithFacebook from "./LoginWithFacebook";
import LoginWithGithub from "./LoginWithGithub";
import ValidateEventToken from "./ValidateEventToken";

type AvailableUseCase =
  | Login
  | ValidateToken
  | ValidateEventToken
  | RefreshToken
  | LoginWithGoogle
  | LoginWithFacebook
  | LoginWithGithub;

@Injectable()
export default class AuthenticationUseCaseFactory extends ServiceFactory<AvailableUseCase> {}
