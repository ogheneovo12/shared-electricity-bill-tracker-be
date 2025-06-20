import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, ChangeRoomOccupantDto } from './rooms.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards';
import { AdminGuard } from 'src/common/guards/admin-guard';

@ApiBearerAuth()
@ApiTags('rooms')
@UseGuards(AccessTokenGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getAllRooms() {
    return this.roomsService.getAllRooms();
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string) {
    return this.roomsService.getRoomById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async createRoom(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @UseGuards(AdminGuard)
  @Put('change-occupant')
  async changeRoomOccupant(@Body() dto: ChangeRoomOccupantDto) {
    return this.roomsService.changeRoomOccupant(dto);
  }
}
