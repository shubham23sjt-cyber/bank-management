export class TransferCommand{
    constructor(public readonly userId:string,
        public readonly toAccountId:string,
        public readonly amount:number,
    ){}
}