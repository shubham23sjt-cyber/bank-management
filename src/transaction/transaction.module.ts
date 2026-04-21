import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransferHandler } from './handler/tranfer.handler';
const handler=[TransferHandler];
@Module({
  imports:[CqrsModule,PrismaModule],
  controllers: [TransactionController],
  providers:[...handler]
})
export class TransactionModule {}
