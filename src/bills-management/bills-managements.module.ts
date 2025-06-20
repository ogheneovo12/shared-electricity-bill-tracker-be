import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from 'src/rooms/rooms.module';
import { Purchase, PurchaseSchema } from './schemas/purchases.schema';
import {
  MeterReading,
  MeterReadingsSchema,
} from './schemas/meter-readings.schema';
import { BillsManagementService } from './bills-management.service';
import { BillsManagementController } from './bills.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: MeterReading.name, schema: MeterReadingsSchema },
    ]),
    RoomsModule,
    UserModule,
  ],
  controllers: [BillsManagementController],
  providers: [BillsManagementService],
  exports: [BillsManagementService],
})
export class BillsManagementModule {}
