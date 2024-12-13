import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ERROR_MESSAGES } from '../constants/messages';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Get('producer-intervals')
  async getProducerIntervals() {
    try {
      const result = await this.moviesService.getProducersWithPrizeIntervals();
      return result;

    } catch (error) {
      throw new HttpException(
        error.message ?? `${ERROR_MESSAGES.DEFAULT_ERROR}`,
        error.httpStatus ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}