import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import UserRepository from '../../../../Api/Repository/UserRepository';
import EmptyFieldException from './exceptions/EmptyFieldException';
import InvalidUserPasswordException from './exceptions/InvalidUserPasswordException';

@Injectable()
export default class Authenticator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashable: Hashable,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async authenticate(email: string, password: string): Promise<any> {
    if (email === '' || password === '') {
      throw new EmptyFieldException();
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error(`User not found with email "${email}"`);
    }

    if (!(await this.hashable.compare(password, user.password))) {
      throw new InvalidUserPasswordException();
    }

    return { ...user };
  }

  async createToken(user: any) {
    return this.jwtService.sign(
      {
        email: this.formatEmail(user.email.toLowerCase()),
        userId: user.id,
      },
      { secret: this.configService.get('JWT_SECRET') }
    );
  }

  async validate(token: string) {
    return this.jwtService.verify(token);
  }

  private formatEmail(field: string): string {
    return field.trim().toLowerCase();
  }
}
