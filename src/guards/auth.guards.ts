import {Injectable,CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthGuard{
    constructor(private readonly jwt:JwtService){}
    canActivate(context:ExecutionContext): boolean{
        const request = context.switchToHttp().getRequest();
        const jwt = request.cookies.jwt;
        if (!jwt) {
            throw new HttpException("unauthorieze", HttpStatus.UNAUTHORIZED)
        }
        const jwt_verify = this.jwt.verify(jwt);
        if (jwt_verify) {
            return true
        }
        return false;
    }

}
