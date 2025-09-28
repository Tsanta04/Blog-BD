import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export class User {
  _id: mongoose.Types.ObjectId; // <- ajoute ceci
  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likes: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  following: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likedUsers: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);