import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';

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
                throw ConflictException;
            }
        
        }catch(error: unknown){
                if(error instanceof ConflictException){
                    this.logger.log(`This email is already registered`);
                    throw error;
                }
                this.logger.error(`Unexpected error: ${String(error)}`);
                throw new ServiceUnavailableException('Failed to create user');
        }

        
    }
}
