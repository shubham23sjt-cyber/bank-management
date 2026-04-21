import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { TransactionDto } from './dto/transaction.dto';
import { TransferCommand } from './commands/tranfer.command';

@Controller('transaction')
export class TransactionController {
    constructor(private commandbus:CommandBus){}

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
}
