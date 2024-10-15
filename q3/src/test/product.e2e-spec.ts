import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'

describe('ProductController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/products (POST)', () => {
        return request(app.getHttpServer())
            .post('/products')
            .send({
                translations: [
                    { language: 'en', name: 'Test Product', description: 'Test Description' },
                ],
            })
            .expect(201);
    });

    it('/products/search (GET)', () => {
        return request(app.getHttpServer())
            .get('/products/search?query=test&language=en')
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('data');
                expect(res.body).toHaveProperty('total');
                expect(res.body).toHaveProperty('page');
                expect(res.body).toHaveProperty('lastPage');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});