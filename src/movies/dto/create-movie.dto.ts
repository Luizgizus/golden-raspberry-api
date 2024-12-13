import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
    @IsNotEmpty()
    @IsNumber()
    year: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    studios: string;

    @IsNotEmpty()
    @IsString()
    producers: string;

    @IsOptional()
    @IsBoolean()
    winner?: boolean;
}