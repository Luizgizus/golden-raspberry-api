import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { InitializationModule } from './initialization/initialization.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        MoviesModule,
        InitializationModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
})
export class AppModule { }