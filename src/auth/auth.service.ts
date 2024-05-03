import {
  Injectable,
  UnauthorizedException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('refreshToken') private refreshJwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signup(createUserDto: any): Promise<any> {
    // Check if the username already exists
    const existingUser = await this.usersService.findOne(
      createUserDto.username,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const user = { ...createUserDto, password: hash };
    const newUser = await this.usersService.create(user);
    const { password, ...result } = newUser.toObject();
    return result;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null; // Make sure it returns null if user is not found
    }
    if (await bcrypt.compare(password, user.password)) {
      return user; // Ensure this returns the complete user object
    }
    return null;
  }

  async hashToken(token: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(token, saltOrRounds);
  }

  async compareTokens(token: string, hashedToken: string): Promise<boolean> {
    return bcrypt.compare(token, hashedToken);
  }

  async login(loginUserDto: any) {
    const user = await this.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );
    console.log('User after lo0gin', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id.toString() };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.refreshJwtService.sign(payload);
    const hashedRefreshToken = await this.hashToken(refreshToken);

    await this.usersService.setRefreshToken(
      hashedRefreshToken,
      user._id.toString(),
    );
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      username: user.username,
      sub: user._id.toString(),
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.refreshJwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (
        !user ||
        !(await this.compareTokens(refreshToken, user.refreshToken))
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = this.jwtService.sign({
        username: payload.username,
        sub: payload.sub,
      });
      const newRefreshToken = this.refreshJwtService.sign({
        username: payload.username,
        sub: payload.sub,
      });
      const hashedNewRefreshToken = await this.hashToken(newRefreshToken);

      await this.usersService.setRefreshToken(
        hashedNewRefreshToken,
        payload.sub,
      );
      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
  }
}
