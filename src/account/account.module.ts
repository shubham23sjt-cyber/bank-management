import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreateAccountHandler } from './handler/account-create.handler';

const handler=[CreateAccountHandler]
@Module({
  imports:[CqrsModule,PrismaModule,AuthModule],
  controllers: [AccountController],
  providers:[...handler]
})
export class AccountModule {}
