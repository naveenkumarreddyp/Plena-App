import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  skip?: string;

  @IsOptional()
  @IsNumberString()
  minage?: string;

  @IsOptional()
  @IsNumberString()
  maxage?: string;
}
