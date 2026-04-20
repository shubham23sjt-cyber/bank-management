import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService,
        private jwt:JwtService,
    ){}

    async register(data:any){
        const{name,email,password}=data;

        const exist=await this.prisma.user.findUnique({
            where:{email},
        })
        if(exist) throw new BadRequestException("Email exists");

        const hash=await bcrypt.hash(password,10);

        const user=await this.prisma.user.create({
            data:{name,email,password:hash},
        })
        return {userId:user.id}
    }
async login(data:any){
    const user= await this.prisma.user.findUnique({
        where:{email:data.email},
    })
    if(!user) throw new BadRequestException("invalid cradential");

    const match=await bcrypt.compare(
        data.password,
        user.password
    );
    if(!match) throw new BadRequestException("invalid credential");

    const token=this.jwt.sign({userId:user.id});

    return {access_token:token};
}
}
