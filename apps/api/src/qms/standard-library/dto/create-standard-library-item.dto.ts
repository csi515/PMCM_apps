import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateStandardLibraryItemDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['PROCESS', 'FAILURE_MODE', 'EFFECT', 'CAUSE', 'DETECTION', 'PREVENTION'])
    category: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
