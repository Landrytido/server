import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import UserRepository from '../../Api/Repository/UserRepository';
import DatasourceModule from '../Datasource/DatasourceModule';
import EventModule from '../Event/EventModule';
import LoggingModule from '../Logging/LoggingModule';
import AuthenticationEventEmitter from './Event/AuthenticationEventEmitter';
import AuthenticationEventSubscriber from './Event/AuthenticationEventSubscriber';
import LocalAuthGuard from './Guard/LocalAuthGuard';
import AuthenticationResolver from './Resolver/AuthenticationResolver';
import Authenticator from './Service/authentication/Authenticator';
import Bcrypt from './Service/encryption/Bcrypt';
import RequestTokenDecoder from './Service/RequestTokenDecoder';
import JwtStrategy from './Strategy/JwtStrategy';
import LocalStrategy from './Strategy/LocalStrategy';
import AuthenticationUseCaseFactory from './UseCase/AuthenticationUseCaseFactory';
import Login from './UseCase/Login';

const authenticator = {
  provide: 'Authenticator',
  imports: [ ConfigModule ],
  useFactory: (
    userRepository: UserRepository,
    bcrypt: Bcrypt,
    jwt: JwtService,
    config: ConfigService
  ) => {
    return new Authenticator(userRepository, bcrypt, jwt, config);
  },
  inject: [ UserRepository, Bcrypt, JwtService, ConfigService ]
};

@Module({
  imports: [
    DatasourceModule,
    ConfigModule,
    EventModule,
    LoggingModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      })
    }),
  ],
  exports: [ Bcrypt ],
  providers: [
    authenticator,
    AuthenticationEventEmitter,
    AuthenticationEventSubscriber,
    AuthenticationUseCaseFactory,
    AuthenticationResolver,
    Bcrypt,
    JwtStrategy,
    LocalStrategy,
    LocalAuthGuard,
    Login,
    RequestTokenDecoder,
    UserRepository,
  ]
})
export default class SecurityModule {}
