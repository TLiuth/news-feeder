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
exports.SummaryEntity = exports.ProcessingStatus = void 0;
const typeorm_1 = require("typeorm");
const article_entity_1 = require("./article.entity");
var ProcessingStatus;
(function (ProcessingStatus) {
    ProcessingStatus["PENDING"] = "pending";
    ProcessingStatus["COMPLETED"] = "completed";
    ProcessingStatus["FAILED"] = "failed";
})(ProcessingStatus || (exports.ProcessingStatus = ProcessingStatus = {}));
let SummaryEntity = class SummaryEntity {
    id;
    s_body;
    bullet_points;
    article;
    processingStatus;
    tokensUsed;
    model;
    createdAt;
};
exports.SummaryEntity = SummaryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SummaryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], SummaryEntity.prototype, "s_body", void 0);
__decorate([
    (0, typeorm_1.Column)("json"),
    __metadata("design:type", Object)
], SummaryEntity.prototype, "bullet_points", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => article_entity_1.ArticleEntity, (article) => article.summary),
    __metadata("design:type", Array)
], SummaryEntity.prototype, "article", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProcessingStatus,
        default: ProcessingStatus.PENDING
    }),
    __metadata("design:type", String)
], SummaryEntity.prototype, "processingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SummaryEntity.prototype, "tokensUsed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SummaryEntity.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SummaryEntity.prototype, "createdAt", void 0);
exports.SummaryEntity = SummaryEntity = __decorate([
    (0, typeorm_1.Entity)('summaries')
], SummaryEntity);
//# sourceMappingURL=summary.entity.js.map