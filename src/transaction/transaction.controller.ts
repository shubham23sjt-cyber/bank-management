import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { TransactionDto } from './dto/transaction.dto';
import { TransferCommand } from './commands/tranfer.command';
import { DepositeDto } from './dto/deposit.dto';
import { DepositeCommand } from './commands/deposite.command';
import { WithdrawCommand } from './commands/withdraw.command';
import { WithdrawDto } from './dto/withdraw.dto';
import { GetTransactionsQuery } from './queries/get-transaction.query';

@Controller('transaction')
export class TransactionController {
    constructor(private commandbus:CommandBus,
        private querybus:QueryBus
    ){}

    @UseGuards(JwtAuthGuard)
    @Get('history')
    getHistory(@Req() req:any){
        return this.querybus.execute(new GetTransactionsQuery(req.user.userId))
    }


    @UseGuards(JwtAuthGuard)
    @Post('transfer')
    transfer(@Req() req:any,@Body() dto:TransactionDto){
        return this.commandbus.execute(
            new TransferCommand(
                req.user.userId,
                dto.toAccountId,
                dto.amount
            )
        )
    }

    @UseGuards(JwtAuthGuard)
    @Post('deposit')
    deposit(@Req() req:any, @Body() dto:DepositeDto){
        return this.commandbus.execute(
            new DepositeCommand(req.user.userId,dto.amount),
        )
    }
    @UseGuards(JwtAuthGuard)
    @Post('withdraw')
    Withdraw(@Req() req:any, @Body() dto:WithdrawDto){
        return this.commandbus.execute(
            new WithdrawCommand(req.user.userId,dto.amount),
        )
    }
}
