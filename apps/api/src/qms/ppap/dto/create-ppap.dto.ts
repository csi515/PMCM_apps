import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';

export class CreatePpapDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    customer: string;

    @IsInt()
    @Min(1)
    @Max(5)
    submissionLevel: number;

    @IsString()
    @IsOptional()
    @IsIn(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'])
    status?: string;
}
