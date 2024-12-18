import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MoviesService } from './../src/movies/movies.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    moviesService = moduleFixture.get<MoviesService>(MoviesService);
    await app.init();

  });

  it('(GET) /movies/producer-intervals cenário minimo e maximo com somente um produtor', async () =>  {
    const response = await request(app.getHttpServer())
      .get('/movies/producer-intervals')
      .expect(200)

      expect(response.body).toHaveProperty('min')
      expect(response.body).toHaveProperty('max')

      expect(response.body.min[0].producer).toBe('Joel Silver')
      expect(response.body.min[0].interval).toBe(1)
      expect(response.body.min[0].previousWin).toBe(1990)
      expect(response.body.min[0].followingWin).toBe(1991)

      expect(response.body.max[0].producer).toBe('Matthew Vaughn')
      expect(response.body.max[0].interval).toBe(13)
      expect(response.body.max[0].previousWin).toBe(2002)
      expect(response.body.max[0].followingWin).toBe(2015)
  });
});