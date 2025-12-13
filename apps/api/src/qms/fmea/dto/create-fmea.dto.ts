import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFmeaDto {
    @IsString()
    @IsNotEmpty()
    fmeaNo: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    partName: string;

    @IsString()
    @IsNotEmpty()
    partNumber: string;

    @IsString()
    @IsOptional()
    revision: string;
}
