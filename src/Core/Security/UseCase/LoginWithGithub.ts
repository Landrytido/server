// src/Core/Security/UseCase/LoginWithGithub.ts

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import UserRepository from '../../../Api/Repository/UserRepository';
import { ContextualGraphqlRequest, UseCase } from '../../../index';
import RequestEventEmitter from '../../Event/Emitter/RequestEventEmitter';
import Authenticator from '../Service/authentication/Authenticator';
import axios from 'axios';

@Injectable()
export default class LoginWithGithub implements UseCase<Promise<string>, [code: string]> {
  constructor(
    @Inject('Authenticator') private authenticator: Authenticator,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: RequestEventEmitter,
  ) {}

  async handle(context: ContextualGraphqlRequest, code: string): Promise<string> {
    try {
      // Échanger le code contre un accessToken
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.configService.get('GITHUB_CLIENT_ID'),
          client_secret: this.configService.get('GITHUB_CLIENT_SECRET'),
          code,
          redirect_uri: this.configService.get('GITHUB_CALLBACK_URL'),
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      if (!accessToken) {
        throw new BadRequestException('Invalid GitHub code or access token not received');
      }

      // Récupérer les informations de l'utilisateur GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/json',
        },
      });

      const userData = userResponse.data;

      if (!userData) {
        throw new BadRequestException('Unable to fetch user data from GitHub');
      }

      let email = userData.email;
      let firstName: string | null = null;
      let lastName: string | null = null;

      // Essayer de déterminer le nom
      // userData.name est généralement le nom complet de l'utilisateur GitHub, mais pas toujours présent
      if (!userData.name || userData.name.trim() === '') {
        firstName = null;
        lastName = null;
      } else {
        // Séparer name si vous souhaitez tenter de le découper
        const parts = userData.name.trim().split(' ');
        firstName = parts[0] || null;
        lastName = parts.length > 1 ? parts.slice(1).join(' ') : null;
      }

      // Si on n'a pas pu déterminer de prénom/nom valide, laisser firstName/lastName à null
      // Cela forcera l'utilisateur à compléter son profil plus tard.

      // Si l'email est null ou vide, récupérer depuis /user/emails
      if (!email) {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/json',
          },
        });

        const emailsData = emailsResponse.data;

        if (!Array.isArray(emailsData) || emailsData.length === 0) {
          throw new BadRequestException('No email found for this GitHub user');
        }

        // Trouver l'email principal et vérifié
        const primaryEmail = emailsData.find((e: any) => e.primary && e.verified);
        email = primaryEmail ? primaryEmail.email : emailsData[0].email;
      }

      // Vérifier la présence de l'email
      if (!email) {
        throw new BadRequestException('Unable to determine user email from GitHub');
      }

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        user = await this.userRepository.create({
          email,
          password: null,
          firstName,
          lastName,
        });
      }

      // Générer un token JWT
      const token = await this.authenticator.createToken(user);

      this.eventEmitter.emit('login_with_github_successfully', { context, email });

      return token;
    } catch (error: any) {
      this.eventEmitter.emit('login_with_github_failed', { context, error: error.message });
      throw new BadRequestException(error.message);
    }
  }
}
