import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TypeMedia, TypeMediaSchema } from "./type-media.schema";
import mongoose from "mongoose";

@Schema()
export class Media {
  _id: mongoose.Types.ObjectId; // <- ajoute ceci
  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ required: true }) 
  pathName: string;

  @Prop({ type: TypeMediaSchema, required: true }) 
  type: TypeMedia;
}

export const MediaSchema = SchemaFactory.createForClass(Media);