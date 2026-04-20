import { JwtStrategy } from './strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'secretkey',
      signOptions: { expiresIn: '1d' }
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule { }
