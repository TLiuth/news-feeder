import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    createUser(createUserDto: CreateUserDto): Promise<{
        succes: boolean;
        data: void;
    }>;
    getUserById(id: number): Promise<{
        user: import("./entities/user.entity").UserEntity;
    }>;
    getUsers(): Promise<{
        users: import("./entities/user.entity").UserEntity[];
    }>;
    deleteUser(id: number): Promise<{
        deletedUser: import("./entities/user.entity").UserEntity;
        deleteResult: import("typeorm").DeleteResult;
    }>;
    updateUserEmail(id: number, email: string): Promise<import("typeorm").UpdateResult>;
    updateUserName(id: number, name: string): Promise<import("typeorm").UpdateResult>;
    updateUserTelephone(id: number, telephone: string): Promise<import("typeorm").UpdateResult>;
}
