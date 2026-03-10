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
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const createUser_dto_1 = require("./dto/createUser.dto");
let UsersController = UsersController_1 = class UsersController {
    usersService;
    logger = new common_1.Logger(UsersController_1.name);
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(createUserDto) {
        const { name, email, telephone } = createUserDto;
        const result = await this.usersService.validateAndCreateUser(name, email, telephone);
        return {
            succes: true,
            data: result
        };
    }
    async getUserById(id) {
        this.logger.log(`Finding user ${id}. Id type: ${typeof (id)}`);
        const user = await this.usersService.getUserById(id);
        return { user };
    }
    async getUsers() {
        this.logger.log(`Finding users`);
        const users = await this.usersService.getUsers();
        return { users };
    }
    async deleteUser(id) {
        this.logger.log(`Deleting user ${id}`);
        const [deletedUser, deleteResult] = await this.usersService.deleteUser(id);
        return { deletedUser, deleteResult };
    }
    async updateUserEmail(id, email) {
        this.logger.log(`Updating user ${id} email: new email ${email}`);
        const result = await this.usersService.updateUserEmail(id, email);
        return result;
    }
    async updateUserName(id, name) {
        this.logger.log(`Updating user ${id} name: new name ${name}`);
        const result = await this.usersService.updateUserName(id, name);
        return result;
    }
    async updateUserTelephone(id, telephone) {
        this.logger.log(`Updating user ${id} telephone: new telephone ${telephone}`);
        const result = await this.usersService.updateUserTelephone(id, telephone);
        return result;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)('update/email/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserEmail", null);
__decorate([
    (0, common_1.Patch)('update/name/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserName", null);
__decorate([
    (0, common_1.Patch)('update/telephone/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('telephone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserTelephone", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map