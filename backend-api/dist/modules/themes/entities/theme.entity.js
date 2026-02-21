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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeEntity = void 0;
const article_entity_1 = require("../../news/entities/article.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let ThemeEntity = class ThemeEntity {
    id;
    name;
    users;
    description;
    keywords;
    isActive;
    articles;
    createdAt;
    updatedAt;
};
exports.ThemeEntity = ThemeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ThemeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ThemeEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.UserEntity, (user) => user.themes),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], ThemeEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("json"),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ThemeEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => article_entity_1.ArticleEntity, (article) => article.themes),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], ThemeEntity.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ThemeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ThemeEntity.prototype, "updatedAt", void 0);
exports.ThemeEntity = ThemeEntity = __decorate([
    (0, typeorm_1.Entity)('themes')
], ThemeEntity);
//# sourceMappingURL=theme.entity.js.map