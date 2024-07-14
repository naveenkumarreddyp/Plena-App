import { IsNotEmpty, IsString } from 'class-validator';

export class UnblockUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  unblockUserId: string;
}
