import { Controller, Post, Query } from '@nestjs/common';
import { read } from 'fs';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Post('create')
    async createUser(@Query() createUserDto: CreateUserDto){
        const { name, email, telephone } = createUserDto;

        const result = await this.usersService.validateAndCreateUser(name, email, telephone )

        return { 
            succes: true,
            data: result
        }
    }
}
