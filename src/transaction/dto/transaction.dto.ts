import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class TransactionDto{
    @IsString()
    toAccountId!:string;

    @Type(()=>Number)
    @IsNumber()
    @Min(1)
    amount!:number;
}