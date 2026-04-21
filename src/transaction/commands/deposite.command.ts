export class DepositeCommand{
    constructor(public readonly userId:string,
        public readonly amount:number
    ){}
}