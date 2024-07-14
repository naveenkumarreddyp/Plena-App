import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly firstname: string;

  @IsOptional()
  @IsString()
  readonly lastname: string;

  @IsOptional()
  @IsString()
  readonly dateofbirth: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  readonly password: string;
}

export const getAllowedFields = (): string[] => {
  return ['firstname', 'lastname', 'dateofbirth', 'password'];
};
