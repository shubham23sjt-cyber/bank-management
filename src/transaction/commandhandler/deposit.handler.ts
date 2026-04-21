import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DepositeCommand } from "../commands/deposite.command";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";
import { PdfService } from "src/pdf/pdf.service";
import { EmailService } from "src/email/email.service";

@CommandHandler(DepositeCommand)
export class DepositeHandler implements ICommandHandler<DepositeCommand>{
    constructor(private prisma:PrismaService,
        private pdfService:PdfService,
        private emailService:EmailService
    ){}

    async execute(command: DepositeCommand): Promise<any> {
        const{userId,amount}=command;

        const result= await this.prisma.$transaction(async(tx)=>{
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
            return { updated, transaction };
        })
        const user=await this.prisma.user.findUnique({where:{id:userId}})
        const {updated,transaction}=result;
        try{
        const pdf=await this.pdfService.generate(transaction);
      await this.emailService.sendMail('user@mail.com','transaction',{
          name:user?.name||'USER',
          amount:transaction.amount.toString(),
          type:transaction.type,
          status:transaction.status,
      },
    pdf,)}
    catch(err){
        console.error('email/pdf failed:',err)
    }
      return {account:updated,transaction}
    }
}