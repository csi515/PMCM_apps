import { IsString, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
    @IsInt()
    userId: number;

    @IsString()
    title: string;

    @IsString()
    message: string;

    @IsString()
    type: string;

    @IsInt()
    @IsOptional()
    relatedEntityId?: number;

    @IsString()
    @IsOptional()
    relatedEntityType?: string;
}
