import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class TypeMedia {
  @Prop({ required: true })
  type: string;
}

export const TypeMediaSchema = SchemaFactory.createForClass(TypeMedia);