import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { mock } from 'node:test';

describe('NewsController', () => {
  let controller: NewsController;

  let newsService: {
    fetchAndStoreNews: jest.Mock;
    getAllArticles: jest.Mock;
  };

  beforeEach(async () => {

    newsService = {
      fetchAndStoreNews: jest.fn(),
      getAllArticles: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [{
        provide: NewsService,
        useValue: newsService,
      }],
    }).compile();

    controller = module.get<NewsController>(NewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("ingestNews should parse dryRun=true and call service with correct args", async () => {
    const mockResult = { fetched: 10, inserted: 8, skipped: 2, failed: 0, dryRun: true};
    newsService.fetchAndStoreNews.mockResolvedValue(mockResult);

    const response = await controller.ingestNews("us", "ai", "true");

    expect(newsService.fetchAndStoreNews).toHaveBeenCalledWith('ai', 'us', true);
    expect(response).toEqual({
      success: true,
      data: mockResult,
    });
  });

  it("ingestNews should parse dryRun=false when query is undefined", async () => {
    const mockResult = { fetched: 0, inserted: 0, skipped: 0, failed: 0, dryRun: false};
    newsService.fetchAndStoreNews.mockResolvedValue(mockResult);

    await controller.ingestNews(undefined, undefined, undefined);

    expect(newsService.fetchAndStoreNews).toHaveBeenCalledWith(undefined, undefined, false);
  });

  it('ingestNews should parse dryRun=false for non-"true" values', async () => {
    const mockResult = { fetched: 1, inserted: 1, skipped: 0, failed: 0, dryRun: false};
    newsService.fetchAndStoreNews.mockResolvedValue(mockResult)

    await controller.ingestNews("br", "tech", "false");

    expect(newsService.fetchAndStoreNews).toHaveBeenCalledWith("tech", "br", false)
  });

  it('getAllArticles should return wrapped articles list', async () => {
    const mockArticles = [{id: 1, headline: "h1"}, {id: 2, headline: "h2"}];
    newsService.getAllArticles.mockResolvedValue(mockArticles)

    const response = await controller.getAllArticles();

    expect(newsService.getAllArticles).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ articles: mockArticles })
  });

  it('should propagate service erros from ingestNews', async () => {
    newsService.fetchAndStoreNews.mockRejectedValue(new Error('boom'));

    await expect(controller.ingestNews('us', 'ai', 'true')).rejects.toThrow('boom')
  })

});
