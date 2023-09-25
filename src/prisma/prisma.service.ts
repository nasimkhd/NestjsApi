import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  //instantiating the PrismaClient
  constructor(config: ConfigService) {
    //super will call the constructor of the class prismaClient
    super({
      //constructor of prismacli\ent need to have db, datasources...
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}
