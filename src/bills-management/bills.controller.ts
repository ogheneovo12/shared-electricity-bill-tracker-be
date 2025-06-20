import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AdminGuard } from 'src/common/guards/admin-guard';
import { BillsManagementService } from './bills-management.service';
import { CreatePurchaseDto, FilterPurchaseDto } from './dtos/purchase.dto';
import {
  CreateReadingDto,
  FilterReadingDto,
  RoomReportQueryDto,
} from './dtos/readings.dto';
import { AccessTokenGuard } from 'src/auth/guards';

@UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('bills-management')
@Controller('bills-management')
export class BillsManagementController {
  constructor(private readonly billsService: BillsManagementService) {}

  @Get('summary')
  async getSummary() {
    return this.billsService.getSummary();
  }

  @UseGuards(AdminGuard)
  @Post('readings')
  async addReading(
    @Body() dto: CreateReadingDto,
    @GetUser('_id') userId: string,
  ) {
    return this.billsService.addReading(dto, userId);
  }

  @Get('readings')
  async getReadings(@Query() query: FilterReadingDto) {
    return this.billsService.getReadings(query);
  }

  @Get('last-readings')
  async lastReadings() {
    return this.billsService.getLastReadingsForAllRooms();
  }

  @Get('purchases')
  async getPurchases(@Query() query: FilterPurchaseDto) {
    return this.billsService.getPurchases(query);
  }

  @Get('room-report')
  async getRoomReport(@Query() query: RoomReportQueryDto) {
    return this.billsService.getRoomReport(query);
  }

  @UseGuards(AdminGuard)
  @Post('purchases')
  async createPurchase(@Body() dto: CreatePurchaseDto) {
    return this.billsService.createPurchase(dto);
  }
}
