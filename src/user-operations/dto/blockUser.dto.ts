import { IsNotEmpty, IsString } from 'class-validator';

export class BlockUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  blockUserId: string;
}