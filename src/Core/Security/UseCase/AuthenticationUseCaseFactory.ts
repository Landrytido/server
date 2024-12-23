import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Factory/ServiceFactory';
import Login from './Login';
import RefreshToken from './RefreshToken';
import ValidateToken from './ValidateToken';
import LoginWithGoogle from './LoginWithGoogle';
import LoginWithFacebook from './LoginWithFacebook';
import LoginWithGithub from './LoginWithGithub';

type AvailableUseCase = Login | ValidateToken | RefreshToken | LoginWithGoogle | LoginWithFacebook | LoginWithGithub;

@Injectable()
export default class AuthenticationUseCaseFactory extends ServiceFactory<AvailableUseCase> {}
