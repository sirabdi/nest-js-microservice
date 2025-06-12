import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class UsersDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);
