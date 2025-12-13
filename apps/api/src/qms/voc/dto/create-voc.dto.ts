import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateVocDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    customer: string;

    @IsString()
    @IsOptional()
    product?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    // @IsEnum(['COMPLAINT', 'INQUIRY', 'SUGGESTION']) // Simplified for now
    type: string;

    @IsString()
    @IsOptional()
    // @IsEnum(['RECEIVED', 'ANALYZING', 'ACTION', 'VERIFIED', 'CLOSED'])
    status?: string;
}
