import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import UserRepository from '../../../Api/Repository/UserRepository';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import Authenticator from '../Service/authentication/Authenticator';

@Injectable()
export default class LoginWithGoogle implements UseCase<Promise<string>, [idToken: string]> {
  private client: OAuth2Client;

  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: RequestEventEmitter,
  ) {
    this.client = new OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
  }

  async handle(context: ContextualGraphqlRequest, idToken: string): Promise<string> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      const email = payload.email;
      const firstName = payload.given_name;
      const lastName = payload.family_name;

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        user = await this.userRepository.create({
          email,
          password: null,
          firstName,
          lastName,
        });
      }

      const token = await this.authenticator.createToken(user);

      this.eventEmitter.emit('login_with_google_successfully', { context, email });

      return token;
    } catch (error) {
      this.eventEmitter.emit('login_with_google_failed', { context, error: error.message });
      throw new BadRequestException(error.message);
    }
  }
}
