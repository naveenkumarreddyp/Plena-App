import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'username can only contain alphanumeric characters',
  })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  readonly lastname: string;

  @IsNotEmpty()
  @IsString()
  readonly dateofbirth: string;
}
