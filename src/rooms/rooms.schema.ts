import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type RoomDocument = mongoose.HydratedDocument<Room>;

export enum RoomEnum {
  ROOM_A = 'ROOM A',
  ROOM_B = 'ROOM B',
  ROOM_C = 'ROOM C',
  ROOM_D = 'ROOM D',
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Room {
  @Prop({
    type: String,
    required: true,
    enum: Object.values(RoomEnum),
    unique: true,
  })
  name: string;

  @Prop({ type: String })
  descrption: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  })
  current_occupant: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  occupant_history: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
