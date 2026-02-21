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
var NewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const article_entity_1 = require("./entities/article.entity");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
let NewsService = NewsService_1 = class NewsService {
    articleRepository;
    httpService;
    configService;
    logger = new common_1.Logger(NewsService_1.name);
    constructor(articleRepository, httpService, configService) {
        this.articleRepository = articleRepository;
        this.httpService = httpService;
        this.configService = configService;
    }
    async fetchAndStoreNews(theme) {
        try {
            const url = this.buildTopHeadLinesUrl(theme);
            const apiArticles = await this.fetchFromNewsAPI(url);
            let inserted = 0;
            for (const apiArticle of apiArticles) {
                const normalized = this.normalizeArticle(apiArticle);
                if (!normalized.url || !normalized.source || !normalized.headline) {
                    continue;
                }
                const existing = await this.articleRepository.findOne({
                    where: {
                        url: normalized.url,
                        source: normalized.source,
                    },
                });
                if (existing) {
                    continue;
                }
                const entity = this.articleRepository.create(normalized);
                await this.articleRepository.save(entity);
                inserted++;
            }
            this.logger.log(`News sync complete. Inserted: ${inserted}`);
            return inserted;
        }
        catch (error) {
            console.log("Error in fetchAndStore:", error);
            throw error;
        }
    }
    buildTopHeadLinesUrl(theme) {
        const baseUrl = this.configService.get('NEWS_API_BASE_URL') ?? '';
        const apiKey = this.configService.get('NEWS_API_KEY') ?? '';
        const pageSize = this.configService.get('NEWS_API_PAGE_SIZE') ?? '20';
        const country = this.configService.get('NEWS_API_COUNTRY') ?? 'us';
        const params = new URLSearchParams({
            apiKey,
            pageSize,
            country,
        });
        if (theme?.trim()) {
            params.set('q', theme.trim());
        }
        return `${baseUrl}/top-headlines?${params.toString()}`;
    }
    async fetchFromNewsAPI(url) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            if (data.status !== 'ok') {
                throw new Error(data.message ?? "News API returned error status");
            }
            return data.articles ?? [];
        }
        catch (error) {
            this.logger.error("Fetch Error from News API:", error);
            throw error;
        }
    }
    normalizeArticle(apiArticle) {
        return {
            url: apiArticle.url ?? "",
            source: apiArticle.source?.name ?? "unknown",
            publishedAt: apiArticle.publishedAt
                ? new Date(apiArticle.publishedAt)
                : new Date(),
            accessDate: new Date(),
            imageUrl: apiArticle.urlToImage ?? '',
            author: apiArticle.author ?? 'unknown',
            headline: apiArticle.title ?? '(untitled)',
            body: apiArticle.content ?? apiArticle.description ?? '',
        };
    }
    getAllArticles() {
        return this.articleRepository.find();
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = NewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.ArticleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], NewsService);
//# sourceMappingURL=news.service.js.map