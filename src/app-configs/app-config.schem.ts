import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type AppConfigDocument = mongoose.HydratedDocument<AppConfig>;

@Schema({ timestamps: true })
export class AppConfig {
  @Prop({ type: String, unique: true, index: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  value: any;
}

export const AppConfigSchema = SchemaFactory.createForClass(AppConfig);
