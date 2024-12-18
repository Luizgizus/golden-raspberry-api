import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { ERROR_MESSAGES } from '../constants/messages';

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
                return this.getProducersResponseInterval(producerIntervals)
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

    private getIntervalData(producer, intervalProducerData) {
        let intervalData = []

        intervalData = intervalProducerData.map(interval => {
            return {
                producer,
                interval: interval.interval,
                previousWin: interval.previousWin,
                followingWin: interval.followingWin,
            }
        })

        return intervalData
    }

    private getProducersResponseInterval(producerIntervals: Record<string, any[]>) {
        let maxIntervals = [];
        let lastMaxIntervalValue = 0;

        let minIntervals = [];
        let lastMinIntervalValue = Infinity;

        for (const [producer, intervals] of Object.entries(producerIntervals)) {

            const largestInterval = Math.max(...intervals.map(interval => interval.interval));
            const maxIntervalData = intervals.filter(interval => interval.interval === largestInterval);

            const smallestInterval = Math.min(...intervals.map(interval => interval.interval));
            const minIntervalData = intervals.filter(interval => interval.interval === smallestInterval);

            if (maxIntervalData && largestInterval >= lastMaxIntervalValue) {
                let intervalData = this.getIntervalData(producer, maxIntervalData)

                if (largestInterval == lastMaxIntervalValue) {
                    maxIntervals.push(intervalData)
                } else {
                    maxIntervals = intervalData
                }

                lastMaxIntervalValue = largestInterval
            }

            if (minIntervalData && smallestInterval <= lastMinIntervalValue) {
                let intervalData = this.getIntervalData(producer, minIntervalData)

                if (smallestInterval == lastMinIntervalValue) {
                    minIntervals.push(intervalData);
                } else {
                    minIntervals = intervalData;
                }

                lastMinIntervalValue = smallestInterval
            }

        }

        return {
            min: minIntervals,
            max: maxIntervals,
        };
    }
}