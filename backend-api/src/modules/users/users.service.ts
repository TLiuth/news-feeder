import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { error } from 'console';

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
}
