import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports:[
        UserModule,
        JwtModule.register({
            global:true,
            secret:"this is my scret key 132",
            signOptions:{expiresIn:"60s"}
        })
    ],
    controllers:[AuthController],
    providers:[AuthService]
})
export class AuthModule {}
