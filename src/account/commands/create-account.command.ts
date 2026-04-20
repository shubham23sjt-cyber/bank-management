export class CreateAccountCommand{
    constructor(public readonly userId:string,
        public readonly initialBalance:number,
    ){}
    
}