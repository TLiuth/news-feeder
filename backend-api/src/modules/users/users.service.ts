import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { error } from 'console';
import { NotFoundError } from 'rxjs';
import { isInstance } from 'class-validator';
import { DeleteResult } from 'typeorm/browser';

type UserType = {
    name: string,
    email: string,
    telephone?: string
}

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private httpService: HttpService,
        private configService: ConfigService
    ) {}

    async validateAndCreateUser(name: string, email: string, telephone?: string){
        try{
            const existing = await this.userRepository.findOne({
                where: {
                    email: email,
                }
            })
        
            if(existing){
                throw new ConflictException("This email is already registered");
            }

            const user: UserType = {
                name: name,
                email: email,
                telephone: telephone ?? ""
            };

            const entity = this.userRepository.create(user);


            await this.userRepository.save(entity)

        
        }catch(error: unknown){
                if(error instanceof ConflictException){
                    throw error;
                }
                this.logger.error(`Unexpected error: ${String(error)}`);
                throw new ServiceUnavailableException('Failed to create user');
        }

        
    }

    async getUserById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: {id: id}})
        this.logger.log(`Getting user... ${user}`)

        if(!user){
            this.logger.log(`There is no user with provided id: ${id}`);
            throw new NotFoundException(`User with id ${id} not found`)
        }else{

            return user
        }
    }

    async getUsers(): Promise<UserEntity[]> {
        const users = await this.userRepository.find()

        this.logger.log(`Getting users... ${users}`)

        if(!users){
            this.logger.log("No users could be found on repository")
            throw new NotFoundException(`Users not found`)
        }

        return users
    }

    async deleteUser(id: number): Promise<[UserEntity, DeleteResult]>{
        const deletedUser = await this.userRepository.findOne({ where: {id: id}})
        const deleteResult = await this.userRepository.delete({id: id})


        if(!deletedUser){
            this.logger.log(`There is no user with provided id to be deleted: ${id}`);
            throw new NotFoundException(`User with id ${id} not found (deleteUser func)`)
        }

        if(!deleteResult){
            this.logger.log(`The user ${id} could not be deleted`);
            throw new NotFoundException(`User with id ${id} could not be deleted`)
        }

        return [deletedUser, deleteResult]
    }

    async updateUserEmail(id: number, email: string){
        const result = await this.userRepository.update(id, { email: email })

        if (!result.affected) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return result
    }

    async updateUserName(id: number, name: string){

        const patch: Partial<UserType> = {
            name: name
        }

        const result = await this.userRepository.update(id, patch)

        if (!result.affected) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return result
    }

    async updateUserTelephone(id: number, telephone: string){

        const patch: Partial<UserType> = {
            telephone: telephone
        }

        const result = await this.userRepository.update(id, patch)

        if (!result.affected) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return result
    }
}
