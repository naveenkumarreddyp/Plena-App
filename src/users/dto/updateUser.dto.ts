import {IsNumber, IsOptional, IsString} from 'class-validator';


export class UpdateUserDto {

 @IsOptional()
  @IsNumber()
  readonly firstname: string;


  @IsOptional()
  @IsString()
  readonly lastname: string;


  @IsOptional()
  @IsString()
  readonly dateofbirth: string;
}
