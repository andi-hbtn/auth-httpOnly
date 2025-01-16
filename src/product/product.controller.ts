import { UseGuards,Controller,Get } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
    constructor(){}

    private techStack = ["Javascript","NodeJs","NestJs","ReactJs","MySql","Redis"];

    @Get()
    public async productList(){
        return this.techStack;
    }
}
