import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TransferCommand } from "../commands/tranfer.command";
import { PrismaService } from "src/prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";
import { EmailService } from "src/email/email.service";
import { PdfService } from "src/pdf/pdf.service";

@CommandHandler(TransferCommand)
export class TransferHandler implements ICommandHandler<TransferCommand>{
    constructor(private readonly prisma:PrismaService,
        private readonly emailService:EmailService,
        private readonly pdfService:PdfService
    ){}
    async execute(command: TransferCommand): Promise<any> {
        const{userId,toAccountId,amount}=command;
        if(amount<=0){
            throw new BadRequestException('invalid amount')
        }
        const transaction=this.prisma.$transaction(async(tx)=>{
            const sender = await tx.account.findFirst({
                where:{userId},
            })

            if(!sender){
                throw new BadRequestException ('sender account not found');
            }

            const receiver = await tx.account.findUnique({
                where:{id:toAccountId}
            })
            if(!receiver){
                throw new BadRequestException('receiver not found');
            }

            if(Number(sender.balance)<amount){
                throw new BadRequestException('insufficient balance');
            }
            await tx.account.update({
                where:{id:sender.id},
                data:{
                    balance:{
                        decrement:amount
                    }
                }
            });
            //credit to reciever
            await tx.account.update({
                where:{id:receiver.id},
                data:{
                    balance:{
                        increment:amount,
                    }
                }
            });
            return tx.transaction.create({
                data:{
                    fromAccountId:sender.id,
                    toAccountId:receiver.id,
                    amount,
                    type:'TRANSFER',
                    status:"SUCCESS"
                },
            });
            
        });
        try{
        const pdf=await this.pdfService.generate(transaction);
      await this.emailService.sendMail('user@mail.com','transaction',{
          name:'Shubham',
          amount:(await transaction).amount,
          type:(await transaction).type,
          status:(await transaction).status,
      },
  pdf,)}
  catch(err){
    console.error("email/pdf failed:",err)
  }
      return transaction;
    }
}