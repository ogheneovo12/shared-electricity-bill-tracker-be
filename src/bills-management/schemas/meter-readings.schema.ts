import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/rooms/rooms.schema';
import { User } from 'src/user/schemas/user.schema';

export type MeterReadingsDocument = mongoose.HydratedDocument<MeterReading>;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class MeterReading {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
  room: Room;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: Date, required: true })
  reading_date: Date;

  @Prop({ type: String })
  screenshot: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recorded_by: User;

  @Prop()
  note: string;
}

export const MeterReadingsSchema = SchemaFactory.createForClass(MeterReading);
