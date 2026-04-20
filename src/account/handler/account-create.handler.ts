import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAccountCommand } from "../commands/create-account.command";
import { PrismaService } from "src/prisma/prisma.service";

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler <CreateAccountCommand>{
    constructor(private readonly prisma:PrismaService){}

    async execute(command: CreateAccountCommand): Promise<any> {
        const accountNumber='ACC-'+Math.floor(Math.random() * 100000000000);

        return this.prisma.account.create({
            data:{
                userId:command.userId,
                accountNumber,
                balance:command.initialBalance || 0,
            }
        })
    }
}