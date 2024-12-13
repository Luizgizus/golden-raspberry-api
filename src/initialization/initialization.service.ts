import { Injectable, OnModuleInit } from '@nestjs/common';
import { MoviesService } from '../movies/movies.service';
import { ConfigService } from '@nestjs/config';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InitializationService implements OnModuleInit {
    constructor(
        private readonly moviesService: MoviesService,
        private configService: ConfigService) {
    }

    async onModuleInit(): Promise<void> {
        await this.loadMoviesFromCSV();
    }

    private async loadMoviesFromCSV(): Promise<void> {
        const filePath = path.join(__dirname, this.configService.get<string>('DB_FILE_PATH'));
        const movies = [];

        const fileStream = fs.createReadStream(filePath);
        const csvStream = csv({ separator: ';' });

        try {
            for await (const data of fileStream.pipe(csvStream)) {
                movies.push({
                    year: parseInt(data['year'], 10),
                    title: data['title'],
                    studios: data['studios'],
                    producers: data['producers'],
                    winner: data['winner']?.toLowerCase() === 'yes',
                });
            }

            await this.moviesService.addMovies(movies);

        } catch (error) {
            console.error('Error processing CSV file:', error);
            throw error;
        }
    }
}