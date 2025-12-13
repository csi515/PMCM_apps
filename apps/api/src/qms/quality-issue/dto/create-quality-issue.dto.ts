import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateQualityIssueDto {
    @IsString()
    @IsNotEmpty()
    issueNo: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    @IsIn(['OPEN', 'CLOSED', 'IN_PROGRESS'])
    status?: string;

    @IsString()
    @IsOptional()
    processStep?: string; // D0, D1, etc.

    // Optional initial population of D-steps
    @IsString()
    @IsOptional()
    d0Containment?: string;
}
