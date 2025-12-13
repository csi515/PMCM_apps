import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSpcChartDto {
    @IsString()
    code: string;

    @IsString()
    title: string;

    @IsNumber()
    @IsOptional()
    nominal?: number;

    @IsNumber()
    @IsOptional()
    usl?: number;

    @IsNumber()
    @IsOptional()
    lsl?: number;
}
