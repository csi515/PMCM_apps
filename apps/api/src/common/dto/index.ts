import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray } from 'class-validator';


// Auth DTOs
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  @IsString()
  access_token: string;
}

export class JwtPayload {
  @IsString()
  username: string;

  @IsNumber()
  sub: number;

  @IsString()
  role: string;
}

// User DTOs
export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  deptCode: string;

  @IsEnum(['USER', 'MANAGER', 'ADMIN'])
  role: 'USER' | 'MANAGER' | 'ADMIN';
}

export class BulkRegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  deptCode: string;

  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @IsOptional()
  @IsEnum(['USER', 'MANAGER', 'ADMIN'])
  role?: 'USER' | 'MANAGER' | 'ADMIN';
}

export class BulkRegisterResultDto {
  @IsNumber()
  success: number;

  @IsNumber()
  failed: number;

  @IsArray()
  @IsString({ each: true })
  errors: string[];
}

