import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoomEnum } from './rooms.schema';
import { IsObjectId } from 'nestjs-object-id';

export class CreateRoomDto {
  @IsEnum(RoomEnum)
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class ChangeRoomOccupantDto {
  @IsObjectId()
  roomId: string;

  @IsObjectId()
  occupantId: string;
}
