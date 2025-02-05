// src/Core/Security/UseCase/LoginWithFacebook.ts

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserRepository from '../../../Api/Repository/UserRepository';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import Authenticator from '../Service/authentication/Authenticator';
import axios from 'axios';

@Injectable()
export default class LoginWithFacebook implements UseCase<Promise<string>, [accessToken: string]> {
  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: RequestEventEmitter,
  ) {}

  async handle(context: ContextualGraphqlRequest, accessToken: string): Promise<string> {
    try {
      // Vérifier le token Facebook via Graph API
      const fields = 'email,first_name,last_name';
      const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`;

      const response = await axios.get(url);
      const payload = response.data;

      if (!payload || !payload.email) {
        throw new BadRequestException('Invalid Facebook token or missing email');
      }

      const email = payload.email;
      let firstName = payload.first_name || null;
      let lastName = payload.last_name || null;

      // Si firstName ou lastName n'est pas fourni, on les met à null pour obliger l'utilisateur à compléter plus tard.
      if (!firstName || firstName.trim() === '') {
        firstName = null;
      }
      if (!lastName || lastName.trim() === '') {
        lastName = null;
      }

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        user = await this.userRepository.create({
          email,
          password: null,
          firstName,
          lastName,
          lastLoginDate:null
        });
      }

      // Générer un token JWT
      const token = await this.authenticator.createToken(user);

      this.eventEmitter.emit('login_with_facebook_successfully', { context, email });

      return token;
    } catch (error: any) {
      this.eventEmitter.emit('login_with_facebook_failed', { context, error: error.message });
      throw new BadRequestException(error.message);
    }
  }
}
