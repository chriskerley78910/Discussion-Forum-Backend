import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // beforeEach(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [AppModule],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();
  //   await app.init();
  // });

  // it('/questions/all (GET)', async () => {
  //   await request(app.getHttpServer())
  //     .get('/questions/all')
  //     .expect(200)
  // });

  // it('/questions/?id=1 (GET)', async () => {
  //   await request(app.getHttpServer())
  //   .get('/questions/?id=1')
  //   .expect(200)
  // })
});
