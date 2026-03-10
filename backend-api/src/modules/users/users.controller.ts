import { Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { read } from 'fs';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateDateColumn } from 'typeorm';

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name)
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

    @Get(':id')
    async getUserById(@Param('id', ParseIntPipe) id: number){
        this.logger.log(`Finding user ${id}. Id type: ${typeof(id)}`)
        
        const user = await this.usersService.getUserById(id)

        return { user };
    }

    @Get('all')
    async getUsers(){
        this.logger.log(`Finding users`)
        const users = await this.usersService.getUsers()

        return { users };
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id', ParseIntPipe) id: number){
        this.logger.log(`Deleting user ${id}`)

        const [ deletedUser, deleteResult ] = await this.usersService.deleteUser(id)

        return { deletedUser, deleteResult }
    }

    @Patch('update/email/:id')
    async updateUserEmail(@Param('id', ParseIntPipe) id: number, @Query ('email') email: string){
        this.logger.log(`Updating user ${id} email: new email ${email}`)

        const result = await this.usersService.updateUserEmail(id, email)

        return result
    }

    @Patch('update/name/:id')
    async updateUserName(@Param('id', ParseIntPipe) id: number, @Query ('name') name: string){
        this.logger.log(`Updating user ${id} name: new name ${name}`)

        const result = await this.usersService.updateUserName(id, name)

        return result
    }

    @Patch('update/telephone/:id')
    async updateUserTelephone(@Param('id', ParseIntPipe) id: number, @Query ('telephone') telephone: string){
        this.logger.log(`Updating user ${id} telephone: new telephone ${telephone}`)

        const result = await this.usersService.updateUserTelephone(id, telephone)

        return result
    }
}
