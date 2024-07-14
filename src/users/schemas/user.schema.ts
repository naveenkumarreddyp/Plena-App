import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;


  @Prop({ required: true })
  password: string;


  @Prop({ required: true })
  firstname: string;


  @Prop({ required: true })
  lastname: string;


  @Prop({ required: true })
  dateofbirth: Date;


  @Prop({ type: [String], default: [],ref: 'User'  })
  blockedusers: string[];


  @Prop({ required: true, unique: true })
  userid: string;
}


export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre('save', function (next) {
  if (!this.userid) {
    this.userid = new Types.ObjectId().toString();
  }
  next();
});


export interface QueryParams { page?: string; limit?: string; skip?: string; keyword?: string; }