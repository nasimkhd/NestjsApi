import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signIn(dto: AuthDto) {
    //find the user by email
    const userFound = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user doenst exist throw error
    if (!userFound) {
      throw new ForbiddenException('Credentials not valid');
    }

    //compare passwords
    const hashCompare = await argon.verify(userFound.hash, dto.password);

    //if password incorrect throw error
    if (!hashCompare) {
      throw new ForbiddenException('Credentials not valid');
    }
    delete (await userFound).hash;

    //send back user
    return this.signToken(userFound.id, userFound.email);
  }

  async signUp(dto: AuthDto) {
    //generate the pasword
    const hash = await argon.hash(dto.password);

    try {
      //save the user
      const user = this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
      });
      delete (await user).hash;
      //if fo instance we do not wanna pass the password we can use select and add those we want to use OR
      // select: {
      //   id: true,
      //   email: true,
      // },
      //return the user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, { expiresIn: '15m', secret: secret });
  }
}
