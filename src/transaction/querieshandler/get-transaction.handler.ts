import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetTransactionsQuery } from "../queries/get-transaction.query";
import { PrismaService } from "src/prisma/prisma.service";

@QueryHandler(GetTransactionsQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionsQuery>{
    constructor(private prisma:PrismaService){}


    async execute(query: GetTransactionsQuery): Promise<any> {
        const{userId}=query;

        const account=await this.prisma.account.findMany({
            where:{userId},
            select:{id:true},
        });
        const accountIds=account.map(a=>a.id);

        //fetch transaction

        const transaction=await this.prisma.transaction.findMany({
            where:{
                OR:[
                    {fromAccountId:{in:accountIds}},
                    {toAccountId:{in:accountIds}},
                ],
            },
            orderBy:{
                createdAt:'desc'
            },
        });
        return transaction;
    }
}