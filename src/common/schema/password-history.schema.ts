import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type PasswordHistoryDocument =
  mongoose.HydratedDocument<PasswordHistory>;

@Schema()
export class PasswordHistory {
  @Prop({ unique: true })
  user_id: string;

  @Prop({ type: [String] })
  passwords: string[];
}

export const PasswordHistorySchema =
  SchemaFactory.createForClass(PasswordHistory);
