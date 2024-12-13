import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { ERROR_MESSAGES } from '../constants/messages';
import { error } from 'console';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) { }

    async deleteAll() {
        await this.movieRepository.clear();
    }

    async addMovies(movies) {
        await this.movieRepository.save(movies);
    }

    async getProducersWithPrizeIntervals() {
        const winners = await this.movieRepository.find({
            where: { winner: true },
            order: { producers: 'ASC', year: 'ASC' },
        });

        if (winners && winners.length) {
            const producerIntervals = this.calculateIntervals(winners);
            if (producerIntervals) {
                const producerWithMaxInterval = this.getProducerWithMaxInterval(producerIntervals);
                const producerWithMinInterval = this.getProducerWithMinInterval(producerIntervals);

                return {
                    min: producerWithMinInterval,
                    max: producerWithMaxInterval,
                };
            }
        }

        throw {
            httpStatus: 404,
            message: ERROR_MESSAGES.MOVIES_NOT_FOUND
        };
    }

    private calculateIntervals(winners: Movie[]) {
        const producerIntervals = {};

        winners.forEach((movie) => {
            const producers = this.parseProducers(movie.producers);

            producers.forEach((producer) => {
                if (!producerIntervals[producer]) {
                    producerIntervals[producer] = [];
                }
                producerIntervals[producer].push(movie.year);
            });
        });

        Object.keys(producerIntervals).forEach((producer) => {
            const years = producerIntervals[producer].sort((a, b) => a - b);
            producerIntervals[producer] = years.reduce((intervals, year, index) => {
                if (index > 0) {
                    intervals.push({
                        interval: year - years[index - 1],
                        previousWin: years[index - 1],
                        followingWin: year,
                    });
                }
                return intervals;
            }, []);
        });

        return producerIntervals;
    }

    private parseProducers(producers: string): string[] {
        const cleanedProducers = producers.replace(/ and /g, ',').split(',');
        return cleanedProducers.map((producer) => producer.trim());
    }

    private getProducerWithMaxInterval(producerIntervals: Record<string, any[]>) {
        let maxIntervals = [];
        let lastMaxIntervalValue = 0;

        for (const [producer, intervals] of Object.entries(producerIntervals)) {
            const largestInterval = Math.max(...intervals.map(interval => interval.interval));
            const maxIntervalData = intervals.find(interval => interval.interval === largestInterval);

            if (maxIntervalData && largestInterval >= lastMaxIntervalValue) {
                if (largestInterval == lastMaxIntervalValue) {
                    maxIntervals.push({
                        producer,
                        interval: largestInterval,
                        previousWin: maxIntervalData.previousWin,
                        followingWin: maxIntervalData.followingWin,
                    });
                } else {
                    maxIntervals = [{
                        producer,
                        interval: largestInterval,
                        previousWin: maxIntervalData.previousWin,
                        followingWin: maxIntervalData.followingWin,
                    }];
                }

                lastMaxIntervalValue = largestInterval
            }
        }

        return maxIntervals;
    }

    private getProducerWithMinInterval(producerIntervals: Record<string, any[]>) {
        let minIntervals = [];
        let lastMinIntervalValue = Infinity;

        for (const [producer, intervals] of Object.entries(producerIntervals)) {
            const smallestInterval = Math.min(...intervals.map(interval => interval.interval));
            const minIntervalData = intervals.find(interval => interval.interval === smallestInterval);

            if (minIntervalData && smallestInterval <= lastMinIntervalValue) {
                if (smallestInterval == lastMinIntervalValue) {
                    minIntervals.push({
                        producer,
                        interval: smallestInterval,
                        previousWin: minIntervalData.previousWin,
                        followingWin: minIntervalData.followingWin,
                    });
                } else {
                    minIntervals = [{
                        producer,
                        interval: smallestInterval,
                        previousWin: minIntervalData.previousWin,
                        followingWin: minIntervalData.followingWin,
                    }];
                }

                lastMinIntervalValue = smallestInterval
            }
        }

        return minIntervals;
    }
}