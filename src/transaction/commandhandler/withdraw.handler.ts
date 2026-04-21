import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WithdrawCommand } from "../commands/withdraw.command";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";

@CommandHandler(WithdrawCommand)
export class WithdrawHanler implements ICommandHandler<WithdrawCommand>{
    constructor(private prisma:PrismaService){}
    async execute(command: WithdrawCommand): Promise<any> {
        const{userId,amount}=command;

        return this.prisma.$transaction(async(tx)=>{
            const account=await tx.account.findFirst({
                where:{userId},
            })
            if(!account){
                throw new BadRequestException("account not found");
            }
            if(Number(account.balance)<amount){
                throw new BadRequestException("insuffiecient balance");

            }

            //deduct money

            const updated=await tx.account.update({
                where:{id:account.id},
                data:{
                    balance:{
                        decrement:amount,
                    }
                }
            });

            const transaction=await tx.transaction.create({
                data:{
                    fromAccountId:account.id,
                    toAccountId:account.id,
                    amount,
                    type:'WITHDRAW',
                    status:'SUCCESS'
                }
            });
            return {account:updated,transaction};
        })
    }
}