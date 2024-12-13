import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitializationService } from './initialization.service';
import { Movie } from '../movies/entities/movie.entity';
import { MoviesService } from '../movies/movies.service';

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],
    providers: [InitializationService, MoviesService],
})
export class InitializationModule { }