import { Module } from '@nestjs/common';
import { UserOperationsController } from './user-operations.controller';
import { UserOperationsService } from './user-operations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserOperationsController],
  providers: [UserOperationsService],
})
export class UserOperationsModule {}
