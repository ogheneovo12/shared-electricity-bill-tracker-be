import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Room } from 'src/rooms/rooms.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
class Contribution {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  })
  room: Room;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  units: number;

  @Prop({ type: String })
  note: string;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class Purchase {
  @Prop({ type: Date, required: true })
  date_purchased: Date;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  total_amount: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  total_units: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  rate: number;

  @Prop({
    type: String,
  })
  receipt_url: string;

  @Prop({ type: [Contribution], default: [] })
  contributions: Contribution[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  recorded_by: User;

  @Prop({ type: String })
  note: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
