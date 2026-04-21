import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TransferHandler } from './commandhandler/tranfer.handler';
import { DepositeHandler } from './commandhandler/deposit.handler';
import { WithdrawHanler } from './commandhandler/withdraw.handler';
import { GetTransactionHandler } from './querieshandler/get-transaction.handler';
const commandhandler=[TransferHandler,DepositeHandler,WithdrawHanler];
const queryhandler=[GetTransactionHandler]
@Module({
  imports:[CqrsModule,PrismaModule],
  controllers: [TransactionController],
  providers:[...commandhandler,...queryhandler]
})
export class TransactionModule {}
