import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from './../users/user.entity';
import { UsersService } from './../users/users.service';
import { LoginPayload } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createToken(user: User) {
    return {
      expiresIn: this.configService.get('jwt.ttl'),
      accessToken: this.jwtService.sign({ id: user.id }),
      user: user,
    };
  }

  async validateUser(payload: LoginPayload): Promise<any> {
    const user = await this.userService.getByEmailAndPass(payload.email, payload.password);
    if (!user) {
      throw new UnauthorizedException('Wrong login combination!');
    }
    return user;
  }
}
