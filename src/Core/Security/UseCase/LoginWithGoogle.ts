import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserRepository from '../../../Api/Repository/UserRepository';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import Authenticator from '../Service/authentication/Authenticator';
import axios from 'axios';

@Injectable()
export default class LoginWithGoogle implements UseCase<Promise<string>, [accessToken: string]> {
  constructor(
        @Inject('Authenticator') private authenticator: Authenticator,
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly eventEmitter: RequestEventEmitter,
  ) {}

  async handle(context: ContextualGraphqlRequest, accessToken: string): Promise<string> {
    try {
      // Appeler l'endpoint userinfo de Google avec l'access_token
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = response.data;

      if (!payload || !payload.email) {
        throw new BadRequestException('Invalid Google access token or missing email');
      }

      const email = payload.email;
      const firstName = payload.given_name || null;
      const lastName = payload.family_name || null;

      let user = await this.userRepository.findByEmail(email);
      if (!user) {
        user = await this.userRepository.create({
          email,
          password: null,
          firstName,
          lastName,
          googleAccessToken: accessToken,      // Stockage du token ici
          googleRefreshToken: payload.refresh_token || null,
          lastLoginDate: new Date(),
        });
      } else {
        // Vous pouvez aussi mettre à jour les tokens si nécessaire
        await this.userRepository.save({
          id: user.id,
          googleAccessToken: accessToken,
          googleRefreshToken: payload.refresh_token || user.googleRefreshToken,
        });
      }

      const token = await this.authenticator.createToken(user);
      this.eventEmitter.emit('login_with_google_successfully', { context, email });

      return token;
    } catch (error: any) {
      this.eventEmitter.emit('login_with_google_failed', { context, error: error.message });
      throw new BadRequestException(error.message);
    }
  }
}