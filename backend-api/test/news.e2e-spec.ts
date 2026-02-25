import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("Ingesting new articles POST /news/ingest", () => {
    const INGEST_NEWS = "/news/ingest"

    it('should return a 201 when ingesting news', () => {
        return request(app.getHttpServer()).post('/news/ingest')
        .query({ country: 'us', theme: 'brasil', dryRun: 'true' })
        .expect(201)
    }, 200000);
  })

  afterAll(async () => {
    await app.close()
  })
  
});
