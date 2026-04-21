import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DepositeCommand } from "../commands/deposite.command";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";

@CommandHandler(DepositeCommand)
export class DepositeHandler implements ICommandHandler<DepositeCommand>{
    constructor(private prisma:PrismaService){}

    async execute(command: DepositeCommand): Promise<any> {
        const{userId,amount}=command;

        return this.prisma.$transaction(async(tx)=>{
            const account=await tx.account.findFirst({
                where:{userId},
            });
            if(!account){
                throw new BadRequestException("account not found");

            }
            //add money
            const updated=await tx.account.update({
                where:{id:account.id},
                data:{
                    balance:{
                        increment:amount,
                    }
                }
            });
            const transaction=await tx.transaction.create({
                data:{
                    fromAccountId:account.id,
                    toAccountId:account.id,
                    amount,
                    type:'DEPOSIT',
                    status:'SUCCESS',

                }
            })
            return {account:updated,transaction}
        })
    }
}