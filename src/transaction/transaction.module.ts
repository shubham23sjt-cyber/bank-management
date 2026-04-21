import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransferHandler } from './handler/tranfer.handler';
import { DepositeHandler } from './handler/deposit.handler';
import { WithdrawHanler } from './handler/withdraw.handler';
const handler=[TransferHandler,DepositeHandler,WithdrawHanler];
@Module({
  imports:[CqrsModule,PrismaModule],
  controllers: [TransactionController],
  providers:[...handler]
})
export class TransactionModule {}
