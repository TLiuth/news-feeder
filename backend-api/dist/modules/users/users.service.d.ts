import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DeleteResult } from 'typeorm/browser';
export declare class UsersService {
    private userRepository;
    private httpService;
    private configService;
    private readonly logger;
    constructor(userRepository: Repository<UserEntity>, httpService: HttpService, configService: ConfigService);
    validateAndCreateUser(name: string, email: string, telephone?: string): Promise<void>;
    getUserById(id: number): Promise<UserEntity>;
    getUsers(): Promise<UserEntity[]>;
    deleteUser(id: number): Promise<[UserEntity, DeleteResult]>;
    updateUserEmail(id: number, email: string): Promise<import("typeorm").UpdateResult>;
    updateUserName(id: number, name: string): Promise<import("typeorm").UpdateResult>;
    updateUserTelephone(id: number, telephone: string): Promise<import("typeorm").UpdateResult>;
}
