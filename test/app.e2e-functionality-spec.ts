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
    await moviesService.deleteAll()

  });

  it('(GET) /movies/producer-intervals cenário minimo e maximo com somente um produtor', async () =>  {
    let movies = getUniqueProducerInterval()

    await moviesService.addMovies(movies)

    const response = await request(app.getHttpServer())
      .get('/movies/producer-intervals')
      .expect(200)

      expect(response.body).toHaveProperty('min')
      expect(response.body).toHaveProperty('max')

      expect(response.body.min[0].producer).toBe('produce 1')
      expect(response.body.min[0].interval).toBe(1)
      expect(response.body.min[0].previousWin).toBe(2010)
      expect(response.body.min[0].followingWin).toBe(2011)

      expect(response.body.max[0].producer).toBe('produce 2')
      expect(response.body.max[0].interval).toBe(5)
      expect(response.body.max[0].previousWin).toBe(2015)
      expect(response.body.max[0].followingWin).toBe(2020)
  });



  it('(GET) /movies/producer-intervals cenário minimo e maximo com vários produtores no mesmo valor de intervalo', async () =>  {
    let movies = getmultipleProducerInterval()

    await moviesService.addMovies(movies)

    const response = await request(app.getHttpServer())
      .get('/movies/producer-intervals')
      .expect(200)

      expect(response.body).toHaveProperty('min')
      expect(response.body).toHaveProperty('max')

      expect(response.body.min[0].producer).toBe('produce 1')
      expect(response.body.min[0].interval).toBe(1)
      expect(response.body.min[0].previousWin).toBe(2010)
      expect(response.body.min[0].followingWin).toBe(2011)

      expect(response.body.min[1].producer).toBe('produce 3')
      expect(response.body.min[1].interval).toBe(1)
      expect(response.body.min[1].previousWin).toBe(1997)
      expect(response.body.min[1].followingWin).toBe(1998)

      expect(response.body.max[0].producer).toBe('produce 2')
      expect(response.body.max[0].interval).toBe(5)
      expect(response.body.max[0].previousWin).toBe(2015)
      expect(response.body.max[0].followingWin).toBe(2020)

      expect(response.body.max[1].producer).toBe('produce 4')
      expect(response.body.max[1].interval).toBe(5)
      expect(response.body.max[1].previousWin).toBe(2000)
      expect(response.body.max[1].followingWin).toBe(2005)
  });

  it('(GET) /movies/producer-intervals cenário banco de dados vazio', async () =>  {
    const response = await request(app.getHttpServer())
      .get('/movies/producer-intervals')
      .expect(404)

    expect(response.body.message).toBe("Não foram encontrados filmes suficientes para fazer a analise")

  });
});








const getUniqueProducerInterval = () => {
  let movies = []

  movies.push({
    year: 2010,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 1",
    winner: true
  })

  movies.push({
    year: 2011,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 1",
    winner: true
  })

  movies.push({
    year: 2015,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 2",
    winner: true
  })

  movies.push({
    year: 2020,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 2",
    winner: true
  })

  return movies
}










const getmultipleProducerInterval = () => {
  let movies = []

  movies.push({
    year: 2010,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 1",
    winner: true
  })

  movies.push({
    year: 2011,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 1",
    winner: true
  })
  
  movies.push({
    year: 1997,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 3",
    winner: true
  })

  movies.push({
    year: 1998,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 3",
    winner: true
  })





  movies.push({
    year: 2015,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 2",
    winner: true
  })

  movies.push({
    year: 2020,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 2",
    winner: true
  })


  movies.push({
    year: 2000,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 4",
    winner: true
  })

  movies.push({
    year: 2005,
    title: "Teste Title",
    studios: "Teste Studio",
    producers: "produce 4",
    winner: true
  })

  return movies
}
