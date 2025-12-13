import { IsString, IsOptional, IsIn, IsJSON } from 'class-validator';

export class UpdateQualityIssueDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    @IsIn(['OPEN', 'CLOSED', 'IN_PROGRESS'])
    status?: string;

    @IsString()
    @IsOptional()
    processStep?: string;

    @IsString()
    @IsOptional()
    d0Containment?: string;

    @IsOptional()
    // @IsJSON() // Validation disabled for simplicity with Prisma Json type, handled as object in DTO often
    d1Team?: any;

    @IsString()
    @IsOptional()
    d2Problem?: string;

    @IsString()
    @IsOptional()
    d3Interim?: string;

    @IsString()
    @IsOptional()
    d4RootCause?: string;

    @IsString()
    @IsOptional()
    d5Corrective?: string;

    @IsString()
    @IsOptional()
    d6Implement?: string;

    @IsString()
    @IsOptional()
    d7Prevent?: string;

    @IsString()
    @IsOptional()
    d8Congrat?: string;
}
