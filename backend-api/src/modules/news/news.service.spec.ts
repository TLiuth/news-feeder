import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NewsService } from './news.service';
import { ArticleEntity } from './entities/article.entity';
import { of } from 'rxjs';

describe('NewsService', () => {
  let service: NewsService;

  const repoMock = {
    findOne: jest.fn(),
    create: jest.fn((x) => x),
    save: jest.fn(),
    find: jest.fn()
  }

  const httpMock = {
    get: jest.fn()
  }

  const configMock = {
    get: jest.fn((key: string) => {
      const map: Record<string, string> = {
        WORLD_NEWS_API_BASE_URL: 'https://api.worldnewsapi.com',
        WORLD_NEWS_API_KEY: 'fake-key',
        WORLD_NEWS_API_AMOUNT_NUMBER: '2',
        WORLD_NEWS_API_LANGUAGE: 'en',
      };

      return map[key];
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: repoMock ,
        },
        {
          provide: HttpService,
          useValue: httpMock ,
        },
        {
          provide: ConfigService,
          useValue: configMock 
        },
      ],
    }).compile();
    jest.clearAllMocks()

    service = module.get<NewsService>(NewsService);
  });

  const newsOne = {
    url: 'https://x.com/a',
    title: "A",
    text: "Body",
    author: "John",
    image: "https://img",
    publish_date : '2026-03-04T00:00:00z',
    source_country: 'us',
  }

  const newsTwo = {
    url: 'https://x.com/b',
    title: "B",
    text: "Body",
    author: "Mary",
    image: "https://img2",
    publish_date : '2026-04-04T00:12:00z',
    source_country: 'us',
  }

  it('dryRun=true should not save and should count insertable items', async () => {
    httpMock.get.mockReturnValue(
      of({
      data: {
        status: "ok",
        news: [ newsOne ],
      },
    }),
  );
  repoMock.findOne.mockResolvedValue(null);

  const result = await service.fetchAndStoreNews('ai', 'us', true)

  expect(result.dryRun).toBe(true);
  expect(result.inserted).toBe(1);
  expect(repoMock.save).not.toHaveBeenCalled();

  }); // end it

  it("dryRun undefined should default to false", async () => {
    httpMock.get.mockReturnValue(
      of({
        data: {
          status: "ok",
          news: [ newsOne, newsTwo ]
        },
      }),
    );

    repoMock.findOne.mockResolvedValue(null);

    const result = await service.fetchAndStoreNews('ai', 'us', undefined)
    
    expect(result.dryRun).toBe(false);
    expect(result.inserted).toBe(2);
    expect(repoMock.save).toHaveBeenCalled();
  }); // end it

  it("fetchAndStoreNews should not work without theme or country", async () => {
    httpMock.get.mockReturnValue(of({
      data: {
        status: "ok",
        news: [ newsOne ]
      },
    }),
  );

  repoMock.findOne.mockResolvedValue(null)

  const result = await service.fetchAndStoreNews(undefined)

  expect(result).toBeDefined()

  }); // end it

  it("getAllArticles should return repository articles", async () => {
    const articles = [
      { url: "https://x.com/a", headline: "A" },
      { url: "https://x.com/b", headline: "B" },
    ] as ArticleEntity[]

    repoMock.find.mockResolvedValue(articles);

    const result = await service.getAllArticles()

    expect(repoMock.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(articles)
  })
});
