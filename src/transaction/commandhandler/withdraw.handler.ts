import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WithdrawCommand } from "../commands/withdraw.command";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";
import { PdfService } from "src/pdf/pdf.service";
import { EmailService } from "src/email/email.service";

@CommandHandler(WithdrawCommand)
export class WithdrawHanler implements ICommandHandler<WithdrawCommand>{
    constructor(private prisma:PrismaService,
        private pdfService:PdfService,
        private emailService:EmailService
    ){}
    async execute(command: WithdrawCommand): Promise<any> {
        const{userId,amount}=command;

        const result=await this.prisma.$transaction(async(tx)=>{
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
            return {updated,transaction}

        })
        const{updated,transaction}=result 
        const safeAmount = Number(transaction.amount);
        const user=await this.prisma.user.findUnique({where:{id:userId}})
        try{
       const pdf=await this.pdfService.generate({...transaction,
        amount:safeAmount}
       );
       await this.emailService.sendMail('user@mail.com','transaction',{
           name:user?.name||'USER',
           amount:transaction.amount,
           type:transaction.type,
           status:transaction.status,
       },
   pdf,)}
   catch(err){
    console.error('email/pdf failed',err);
   }
       return {account:updated,transaction};
    }  
}