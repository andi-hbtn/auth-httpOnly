import { Controller, Post,Body, HttpException,HttpStatus,Res} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService:UserService,
        private readonly jwt:JwtService
    ){}

    @Post('register')
    public async registerUser(@Body() bodyParam: RegisterUserDto):Promise<UserEntity>{
        try{
            const result = await this.userService.findByEmail(bodyParam.email);
            if(result){
                throw new HttpException("You already have an account",HttpStatus.FOUND);
            }
            return this.userService.registerUser(bodyParam);
        }catch(error){
            if (error instanceof HttpException) {
                throw error; // Rethrow the HttpException for the global error handler
            }
            // Handle unexpected errors with a generic message
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    public async loginUser(
        @Body() bodyParam:LoginUserDto,
        @Res({passthrough:true}) response:Response
    ):Promise<UserEntity>{
        try {
            const user = await this.userService.loginUser(bodyParam.email,bodyParam.password);
            const jwt = await this.jwt.signAsync({id:user.id});
            response.cookie('jwt', jwt, { httpOnly: true });
            return user;
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('logout')
    public async logoutUser(@Res({passthrough:true}) response:Response):Promise<any>{
        response.clearCookie('jwt');
        return {"message":"You are successfully logout",status:200}
    }
    
}
