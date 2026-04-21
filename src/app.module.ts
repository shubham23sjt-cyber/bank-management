import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { EmailModule } from './email/email.module';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule, PrismaModule, AccountModule, TransactionModule, EmailModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
