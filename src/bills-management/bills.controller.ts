import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { AdminGuard } from 'src/common/guards/admin-guard';
import { BillsManagementService } from './bills-management.service';
import { CreatePurchaseDto } from './dtos/purchase.dto';
import { CreateReadingDto, RoomReportQueryDto } from './dtos/readings.dto';

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
  @Post('reading')
  async addReading(
    @Body() dto: CreateReadingDto,
    @GetUser('_id') userId: string,
  ) {
    return this.billsService.addReading(dto, userId);
  }

  @Get('room-report')
  async getRoomReport(@Query() query: RoomReportQueryDto) {
    return this.billsService.getRoomReport(query);
  }

  @UseGuards(AdminGuard)
  @Post('purchase')
  async createPurchase(@Body() dto: CreatePurchaseDto) {
    return this.billsService.createPurchase(dto);
  }
}
