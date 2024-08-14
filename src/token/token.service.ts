import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(user) {
    const payload = { user };

    return this.jwtService.sign(payload, {
      secret: 'mySecretKey',
      expiresIn: 86000,
    });
  }
}
