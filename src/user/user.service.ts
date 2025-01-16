import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { RegisterUserDto } from 'src/auth/dto/RegisterUser.dto';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity> ){}

    public async findByEmail(email:string): Promise<UserEntity>{
        return await this.userRepository.findOne({where:{email:email}})
    }

    public async registerUser(data:RegisterUserDto): Promise<UserEntity>{
        //... quhet spread operator dhe merr te gjitha pronesite/property nga obj data dhe i ruan ne obj e ri
        // obj i ri u krijua ne momentin qe ne vendosem {}
        //celesi password do te mbishkruhet nese ai ekziston dhe do marri vleren e re
        return await this.userRepository.save({
            ...data,
            password: await this.hashPassword(data.password)
        });
    }

    public async hashPassword(password:string):Promise<any>{
        return bcrypt.hash(password,10);
    }

    public async comparePassword(password:string,hashedPass:string):Promise<boolean>{
        try{
            const result = await bcrypt.compare(password,hashedPass);
            return result;
        }catch(error){
            throw new HttpException("Your password is not correct",HttpStatus.NOT_ACCEPTABLE)
        }
    }

    public async loginUser(email:string,password:string):Promise<UserEntity>{
        try{
            const result =  await this.userRepository.findOne({where:{email}}) ;
            
            if(!result){
                throw new HttpException("You does not have an account,please create one!",HttpStatus.NOT_FOUND);
            }
            const checkPassword = await this.comparePassword(password,result.password);
            if(!checkPassword){
                throw new HttpException("Your password is not correct!",HttpStatus.UNAUTHORIZED);
            }
            return result;
        } catch(error){
            if(error instanceof HttpException){
                throw error
            }
        }
    }
}
