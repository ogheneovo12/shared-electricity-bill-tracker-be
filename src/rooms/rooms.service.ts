import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericError, NotFoundError } from 'src/errors';
import { UserService } from 'src/user/user.service';
import { Room, RoomDocument, RoomEnum } from './rooms.schema';
import { ChangeRoomOccupantDto, CreateRoomDto } from './rooms.dto';

@Injectable()
export class RoomsService {
  logger: Logger = new Logger(RoomsService.name);

  constructor(
    @InjectModel(Room.name) private readonly roomsModel: Model<RoomDocument>,
    private userService: UserService,
  ) {}

  async onModuleInit() {
    await this.createInitialRooms();
  }

  async getAllRooms() {
    return this.roomsModel
      .find()
      .sort({ name: 1 })
      .populate(['current_occupant', 'occupant_history']);
  }

  async getRoomById(roomId: string) {
    const room = await this.roomsModel
      .findById(roomId)
      .populate(['current_occupant', 'occupant_history']);
    if (!room) {
      throw new NotFoundError('Room', 'id', roomId);
    }

    return room;
  }

  async createRoom(dto: CreateRoomDto) {
    const isExisting = await this.roomsModel.exists({ name: dto.name });
    if (isExisting) {
      throw new GenericError(`Room ${dto.name} Already exists`);
    }
    return this.roomsModel.create(dto);
  }

  async changeRoomOccupant(dto: ChangeRoomOccupantDto) {
    const room = await this.getRoomById(dto.roomId);
    const user = await this.userService.findById(dto.occupantId);

    if (!user) {
      throw new NotFoundError('Occupant', 'id', dto.occupantId);
    }

    if (
      room.current_occupant &&
      room?.current_occupant?._id?.toString() === dto.occupantId
    ) {
      throw new GenericError(
        'this occupant is the current occupant of this room',
      );
    }
    const push_query = room.current_occupant
      ? {
          $push: {
            occupant_history: room.current_occupant,
          },
        }
      : {};
    const updatedRoom = await this.roomsModel
      .findByIdAndUpdate(
        room._id,
        {
          current_occupant: user._id,
          ...push_query,
        },
        { new: true },
      )
      .populate(['current_occupant', 'occupant_history']);

    user.currentRoom = room._id as unknown as Room;
    await user.save();

    return updatedRoom;
  }

  async createInitialRooms() {
    const roomsCount = await this.roomsModel.countDocuments();

    if (roomsCount >= 1) return;

    const rooms = await this.roomsModel.create(
      Object.values(RoomEnum).map((name) => ({ name, descrption: '' })),
    );

    this.logger.log(
      `CREATED ${rooms.length} ROOMS: ${rooms.map((r) => r.name).join(',')}`,
    );
  }
}
