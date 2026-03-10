"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
let UsersService = UsersService_1 = class UsersService {
    userRepository;
    httpService;
    configService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userRepository, httpService, configService) {
        this.userRepository = userRepository;
        this.httpService = httpService;
        this.configService = configService;
    }
    async validateAndCreateUser(name, email, telephone) {
        try {
            const existing = await this.userRepository.findOne({
                where: {
                    email: email,
                }
            });
            if (existing) {
                throw new common_2.ConflictException("This email is already registered");
            }
            const user = {
                name: name,
                email: email,
                telephone: telephone ?? ""
            };
            const entity = this.userRepository.create(user);
            await this.userRepository.save(entity);
        }
        catch (error) {
            if (error instanceof common_2.ConflictException) {
                throw error;
            }
            this.logger.error(`Unexpected error: ${String(error)}`);
            throw new common_1.ServiceUnavailableException('Failed to create user');
        }
    }
    async getUserById(id) {
        const user = await this.userRepository.findOne({ where: { id: id } });
        this.logger.log(`Getting user... ${user}`);
        if (!user) {
            this.logger.log(`There is no user with provided id: ${id}`);
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        else {
            return user;
        }
    }
    async getUsers() {
        const users = await this.userRepository.find();
        this.logger.log(`Getting users... ${users}`);
        if (!users) {
            this.logger.log("No users could be found on repository");
            throw new common_1.NotFoundException(`Users not found`);
        }
        return users;
    }
    async deleteUser(id) {
        const deletedUser = await this.userRepository.findOne({ where: { id: id } });
        const deleteResult = await this.userRepository.delete({ id: id });
        if (!deletedUser) {
            this.logger.log(`There is no user with provided id to be deleted: ${id}`);
            throw new common_1.NotFoundException(`User with id ${id} not found (deleteUser func)`);
        }
        if (!deleteResult) {
            this.logger.log(`The user ${id} could not be deleted`);
            throw new common_1.NotFoundException(`User with id ${id} could not be deleted`);
        }
        return [deletedUser, deleteResult];
    }
    async updateUserEmail(id, email) {
        const result = await this.userRepository.update(id, { email: email });
        if (!result.affected) {
            throw new common_1.NotFoundException(`User ${id} not found`);
        }
        return result;
    }
    async updateUserName(id, name) {
        const patch = {
            name: name
        };
        const result = await this.userRepository.update(id, patch);
        if (!result.affected) {
            throw new common_1.NotFoundException(`User ${id} not found`);
        }
        return result;
    }
    async updateUserTelephone(id, telephone) {
        const patch = {
            telephone: telephone
        };
        const result = await this.userRepository.update(id, patch);
        if (!result.affected) {
            throw new common_1.NotFoundException(`User ${id} not found`);
        }
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map