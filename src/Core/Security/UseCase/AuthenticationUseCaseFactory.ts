import { Injectable } from '@nestjs/common';
import ServiceFactory from '../../Factory/ServiceFactory';
import Login from './Login';
import RefreshToken from './RefreshToken';
import ValidateToken from './ValidateToken';

type AvailableUseCase = Login | ValidateToken | RefreshToken;

@Injectable()
export default class AuthenticationUseCaseFactory extends ServiceFactory<AvailableUseCase> {}
