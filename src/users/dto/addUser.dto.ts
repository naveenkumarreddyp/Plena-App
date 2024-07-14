import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';


export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;


  @IsNotEmpty()
  @IsNumber()
  readonly firstname: string;


  @IsNotEmpty()
  @IsString()
  readonly lastname: string;


  @IsNotEmpty()
  @IsString()
  readonly dateofbirth: string;
}
