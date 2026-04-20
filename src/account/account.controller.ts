import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateAccountCommand } from './commands/create-account.command';

@Controller('account')
export class AccountController {
    constructor(private commandbus:CommandBus){}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req:any,@Body() dto:CreateAccountDto){
        return this.commandbus.execute(
            new CreateAccountCommand(
                req.user?.userId,
                dto.initialBalance,
            )
        )
    }
}
