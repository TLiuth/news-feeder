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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const common_2 = require("@nestjs/common");
const axios_2 = __importDefault(require("axios"));
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
    async fetchAndStoreNews(theme, country, dryRun = false) {
        try {
            const url = this.buildWorldNewsSearchUrl(theme, country);
            const apiArticles = await this.fetchFromWorldNewsAPI(url);
            console.log(apiArticles);
            console.log(`news returned: ${apiArticles.length}`);
            const result = {
                fetched: apiArticles.length,
                inserted: 0,
                skipped: 0,
                failed: 0,
                dryRun: dryRun,
            };
            for (const apiArticle of apiArticles) {
                const normalized = this.normalizeArticle(apiArticle);
                console.log(normalized);
                if (!normalized.url || !normalized.headline) {
                    result.skipped++;
                    continue;
                }
                const existing = await this.articleRepository.findOne({
                    where: {
                        url: normalized.url,
                        worldNewsId: normalized.worldNewsId,
                    },
                });
                if (existing) {
                    result.skipped++;
                    continue;
                }
                if (dryRun) {
                    result.inserted++;
                    continue;
                }
                const entity = this.articleRepository.create(normalized);
                try {
                    await this.articleRepository.save(entity);
                    result.inserted++;
                }
                catch (error) {
                    this.logger.log(`FetchAndStoreNews - Error: ${error}`);
                    result.failed++;
                    continue;
                }
            }
            if (dryRun) {
                this.logger.log(`DryRun Mode: No news inserted. ${result.fetched} articles processed.`);
                return result;
            }
            this.logger.log(`News sync complete. Inserted: ${result.inserted} - Failed or skipped: ${result.skipped + result.failed}`);
            return result;
        }
        catch (error) {
            this.logger.log("Error in fetchAndStore:", error);
            throw error;
        }
    }
    buildWorldNewsSearchUrl(theme, country) {
        const baseUrl = this.configService.get('WORLD_NEWS_API_BASE_URL') ?? '';
        const apiKey = this.configService.get('WORLD_NEWS_API_KEY') ?? '';
        const amountNumber = this.configService.get('WORLD_NEWS_API_AMOUNT_NUMBER') ?? '20';
        const language = this.configService.get('WORLD_NEWS_API_LANGUAGE') ?? "br";
        const params = new URLSearchParams({
            'api-key': apiKey,
            'number': amountNumber,
            'language': language,
        });
        if (theme?.trim()) {
            params.set('text', theme.trim());
        }
        if (country?.trim()) {
            params.set('source-country', country.trim());
        }
        if (!baseUrl || !apiKey) {
            throw new common_2.InternalServerErrorException("URL or API Key missing!");
        }
        const url = `${baseUrl}/search-news?${params.toString()}`;
        return url;
    }
    async fetchFromWorldNewsAPI(url) {
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            if (!data) {
                throw new common_2.BadGatewayException("World News API returned error status");
            }
            return data.news ?? [];
        }
        catch (error) {
            if (error instanceof common_2.BadGatewayException || error instanceof common_2.ServiceUnavailableException) {
                throw error;
            }
            if (axios_2.default.isAxiosError(error)) {
                const status = error.response?.status;
                if (!status) {
                    this.logger.error(`News API network error: ${error.code} ${error.message}`);
                    throw new common_2.ServiceUnavailableException("News provider unavailable (network/timeout)");
                }
                this.logger.error(`News API upstream error: HTTP ${status} - ${error.message}`);
                throw new common_2.BadGatewayException(`News provider returned HTTP ${status}`);
            }
            this.logger.error(`Unexpected fetch error: ${String(error)}`);
            throw new common_2.ServiceUnavailableException('Failed to fetch news from provider');
        }
    }
    normalizeArticle(apiArticle) {
        return {
            worldNewsId: apiArticle.id,
            url: apiArticle.url ?? "",
            publishedAt: apiArticle.publish_date
                ? new Date(apiArticle.publish_date)
                : new Date(),
            accessDate: new Date(),
            imageUrl: apiArticle.image ?? '',
            author: apiArticle.authors?.[0] ?? 'unknown',
            headline: apiArticle.title ?? '(untitled)',
            body: apiArticle.text ?? '',
            source_country: apiArticle.source_country,
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