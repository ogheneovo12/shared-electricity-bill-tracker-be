import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Room } from 'src/rooms/rooms.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.tempLoginToken;
      delete ret.tempLoginTokenExpiry;
      delete ret.refreshTokenHash;
    },
  },
  toObject: { virtuals: true },
})
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  })
  email: string;

  @Prop({ type: String })
  first_name: string;

  @Prop({ type: String })
  last_name: string;

  @Prop({ type: String })
  display_name: string;

  @Prop({ type: Boolean })
  is_admin: boolean;

  @Prop({ type: Date, default: null })
  last_login?: Date;

  @Prop({ type: String, default: null })
  profile_photo?: string | null;

  @Prop({ type: String, default: null })
  tempLoginToken?: string | null;

  @Prop({ type: Date, default: null })
  tempLoginTokenExpiry?: Date | null;

  @Prop()
  refreshTokenHash?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  currentRoom: Room;
}

export const UserSchema = SchemaFactory.createForClass(User);
