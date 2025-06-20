import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppConfigKey } from 'src/app-configs/app-config.constant';
import { AppConfigService } from 'src/app-configs/app-config.service';
import {
  currentReadings,
  initialReadings,
  purchaseHistory,
} from 'src/common/seeds/initial_readings';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserService } from 'src/user/user.service';
import { CreatePurchaseDto, FilterPurchaseDto } from './dtos/purchase.dto';
import {
  CreateReadingDto,
  FilterReadingDto,
  RoomReportQueryDto,
} from './dtos/readings.dto';
import { MeterReading } from './schemas/meter-readings.schema';
import { Contribution, Purchase } from './schemas/purchases.schema';

@Injectable()
export class BillsManagementService {
  private logger: Logger = new Logger(BillsManagementService.name);
  constructor(
    @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
    @InjectModel(MeterReading.name)
    private readonly meterReadingModel: Model<MeterReading>,
    private roomService: RoomsService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async onModuleInit() {
    await this.seedReadings();
    await this.seedPurchases();
  }

  async createPurchase(dto: CreatePurchaseDto, recorded_by?: string) {
    // Validate room IDs in contributions
    for (const contrib of dto.contributions) {
      const roomExists = await this.roomService.getRoomById(contrib.room);
      if (!roomExists) {
        throw new BadRequestException(`Invalid room ID: ${contrib.room}`);
      }
    }
    const purchase = new this.purchaseModel({ ...dto, recorded_by });

    purchase.rate = purchase.total_amount / purchase.total_units;

    purchase.contributions.forEach((contribution) => {
      contribution.units = contribution.amount / purchase.rate;
    });

    return purchase.save();
  }

  async getSummary() {
    const rooms = await this.roomService.getAllRooms();
    const summary = await Promise.all(
      rooms.map(async (room) => {
        // Get all readings for the room
        const readings = await this.meterReadingModel
          .find({ room: room._id })
          .sort({ date: 1 });

        // Get all purchases for the room
        const purchases = await this.purchaseModel.find({
          'contributions.room': room._id,
        });

        // Calculate total units purchased
        const unitsPurchased = purchases.reduce((total, purchase) => {
          const roomContrib = purchase.contributions.find(
            (c) => c.room.toString() === room._id.toString(),
          );
          return total + (roomContrib ? roomContrib.units : 0);
        }, 0);

        // Calculate total units purchased
        const amountContributed = purchases.reduce((total, purchase) => {
          const roomContrib = purchase.contributions.find(
            (c) => c.room.toString() === room._id.toString(),
          );
          return total + (roomContrib ? roomContrib.amount : 0);
        }, 0);

        // Calculate total consumption
        const unitsConsumed =
          readings.length > 1
            ? readings.slice(1).reduce((sum, reading, idx) => {
                const diff = reading.value - readings[idx].value;
                return sum + (diff > 0 ? diff : 0); // ignore negative diffs (e.g., rollovers)
              }, 0)
            : 0;

        const balance = unitsPurchased - unitsConsumed;

        const lastPurchase = purchases[purchases.length - 1];
        const rate = lastPurchase ? lastPurchase.rate : 0;
        const amountOwed = balance < 0 ? Math.abs(balance) * rate : 0;
        return {
          room: room.name,
          currentOccupant: room.current_occupant,
          unitsPurchased,
          unitsConsumed,
          balance,
          lastReading:
            readings.length > 0 ? readings[readings.length - 1].value : null,
          lastReadingDate:
            readings.length > 0
              ? readings[readings.length - 1].reading_date
              : null,
          is_owing: balance < 0,
          amountOwed,
          unitsPurchasedAmount: unitsPurchased * rate,
          amountContributed,
        };
      }),
    );

    return summary;
  }

  /**
   * Add a new meter reading for a room, with duplicate value check.
   */
  async addReading(dto: CreateReadingDto, userId: string) {
    // Check for duplicate value (latest reading)
    const lastReading = await this.meterReadingModel
      .findOne({ room: dto.roomId })
      .sort({ reading_date: -1 })
      .limit(1);

    if (lastReading && lastReading.value === dto.value) {
      throw new BadRequestException('Duplicate reading value');
    }

    const newReading = new this.meterReadingModel({
      room: dto.roomId,
      value: dto.value,
      reading_date: dto.reading_date,
      screenshot: dto.screenshot,
      recorded_by: userId,
    });

    return newReading.save();
  }

  async updatePurchase(purchaseId: string, dto: Partial<CreatePurchaseDto>) {
    const purchase = await this.purchaseModel.findById(purchaseId);
    if (!purchase) throw new BadRequestException('Purchase not found');

    // Optionally: validate room IDs in contributions if updating them
    if (dto.contributions) {
      for (const contrib of dto.contributions) {
        const roomExists = await this.roomService.getRoomById(contrib.room);
        if (!roomExists) {
          throw new BadRequestException(`Invalid room ID: ${contrib.room}`);
        }
      }
      purchase.contributions = dto.contributions as unknown as Contribution[];
    }

    if (dto.total_amount !== undefined)
      purchase.total_amount = dto.total_amount;
    if (dto.total_units !== undefined) purchase.total_units = dto.total_units;
    if (dto.date_purchased !== undefined)
      purchase.date_purchased = dto.date_purchased;

    // Recalculate rate and units if relevant fields changed
    if (
      dto.total_amount !== undefined ||
      dto.total_units !== undefined ||
      dto.contributions
    ) {
      purchase.rate = purchase.total_amount / purchase.total_units;
      purchase.contributions.forEach((contribution) => {
        contribution.units = contribution.amount / purchase.rate;
      });
    }

    return purchase.save();
  }

  async updateReading(readingId: string, dto: Partial<CreateReadingDto>) {
    const reading = await this.meterReadingModel.findById(readingId);
    if (!reading) throw new BadRequestException('Reading not found');

    if (dto.value !== undefined) reading.value = dto.value;
    if (dto.reading_date !== undefined)
      reading.reading_date = new Date(dto.reading_date);
    if (dto.screenshot !== undefined) reading.screenshot = dto.screenshot;

    return reading.save();
  }

  /**
   * Get consumption report for a room within a date range.
   */
  async getRoomReport(query: RoomReportQueryDto) {
    const { roomId, startDate, endDate } = query;

    // Get readings within date range
    const readings = await this.meterReadingModel
      .find({
        room: roomId,
        reading_date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .sort({ reading_date: 1 });

    if (readings.length < 2) {
      throw new BadRequestException('Insufficient data for report');
    }

    // Calculate consumption
    const firstReading = readings[0].value;
    const lastReading = readings[readings.length - 1].value;
    const unitsConsumed = lastReading - firstReading;

    // Get purchases within date range
    const purchases = await this.purchaseModel.find({
      'contributions.room': roomId,
      date_purchased: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    // Calculate total units purchased
    const unitsPurchased = purchases.reduce((total, purchase) => {
      const roomContribution = purchase.contributions.find(
        (c) => c.room.toString() === roomId,
      );
      return total + (roomContribution ? roomContribution.units : 0);
    }, 0);

    // Calculate balance
    const balance = unitsPurchased - unitsConsumed;
    const lastPurchase = purchases[purchases.length - 1];
    const rate = lastPurchase ? lastPurchase.rate : 0;
    const amountOwed = balance < 0 ? Math.abs(balance) * rate : 0;

    return {
      startDate,
      endDate,
      firstReading,
      lastReading,
      unitsConsumed,
      unitsPurchased,
      balance,
      is_owing: balance < 0,
      amountOwed,
      unitsPurchasedAmount: unitsPurchased * rate,
    };
  }

  async getReadings(filter: FilterReadingDto) {
    const query: any = {};
    if (filter.roomId) {
      query.room = filter.roomId;
    }
    if (filter.startDate || filter.endDate) {
      query.reading_date = {};
      if (filter.startDate) {
        query.reading_date.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        query.reading_date.$lte = new Date(filter.endDate);
      }
    }
    // Optionally, sort by reading_date ascending
    return this.meterReadingModel
      .find(query)
      .sort({ reading_date: -1 })
      .populate([{ path: 'room', populate: 'current_occupant' }]);
  }

  async getPurchases(filter: FilterPurchaseDto) {
    const query: any = {};
    if (filter.startDate || filter.endDate) {
      query.date_purchased = {};
      if (filter.startDate) {
        query.date_purchased.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        query.date_purchased.$lte = new Date(filter.endDate);
      }
    }

    return this.purchaseModel
      .find(query)
      .sort({ date_purchased: 1 })
      .populate({
        path: 'contributions',
        populate: { path: 'room', populate: ['current_occupant'] },
      });
  }

  /**
   * Get the most recent meter reading for each room.
   */
  async getLastReadingsForAllRooms() {
    const rooms = await this.roomService.getAllRooms();
    const lastReadings = await Promise.all(
      rooms.map(async (room) => {
        const lastReading = await this.meterReadingModel
          .findOne({ room: room._id })
          .sort({ reading_date: -1 })
          .populate([{ path: 'room', populate: 'current_occupant' }]);
        return {
          room: room.name,
          currentOccupant: room.current_occupant,
          lastReading: lastReading ? lastReading.value : null,
          lastReadingDate: lastReading ? lastReading.reading_date : null,
        };
      }),
    );
    return lastReadings;
  }

  async seedReadings() {
    const config = await this.appConfigService.getConfig(
      AppConfigKey.SEEDED_INITIAL_READINGS,
    );

    if (config && config.value === true) return;

    const admin = await this.userService.findByEmail(
      this.configService.get<string>('INITIAL_ADMIN_EMAIL', ''),
    );
    const rooms = await this.roomService.getAllRooms();
    const roomsMap = rooms.reduce(
      (acc, curr) => {
        acc[curr.name] = curr._id;
        return acc;
      },
      {} as Record<string, Types.ObjectId>,
    );

    for (const reading of initialReadings) {
      const newReading = new this.meterReadingModel({
        room: roomsMap[reading.room],
        value: reading.value,
        recorded_by: admin?._id,
        reading_date: reading.date,
      });
      await newReading.save();
    }

    for (const reading of currentReadings) {
      const newReading = new this.meterReadingModel({
        room: roomsMap[reading.room],
        value: reading.value,
        recorded_by: admin?._id,
        reading_date: reading.date,
      });
      await newReading.save();
    }
    await this.appConfigService.setConfig(
      AppConfigKey.SEEDED_INITIAL_READINGS,
      true,
    );
    this.logger.log('SEEDED INITIAL READING');
  }

  async seedPurchases() {
    const config = await this.appConfigService.getConfig(
      AppConfigKey.SEEDED_INITIAL_PURCHASE,
    );

    if (config && config.value === true) return;

    const admin = await this.userService.findByEmail(
      this.configService.get<string>('INITIAL_ADMIN_EMAIL', ''),
    );
    const rooms = await this.roomService.getAllRooms();
    const roomsMap = rooms.reduce(
      (acc, curr) => {
        acc[curr.name] = curr._id;
        return acc;
      },
      {} as Record<string, Types.ObjectId>,
    );

    for (const purchase of purchaseHistory) {
      await this.createPurchase(
        {
          date_purchased: purchase.date_purchased,
          total_amount: purchase.total_amount,
          total_units: purchase.total_units,
          contributions: purchase.contributions.map((con) => ({
            room: roomsMap[con.room]?.toString(),
            amount: con.amount,
          })),
        },
        admin?._id?.toString(),
      );
    }
    await this.appConfigService.setConfig(
      AppConfigKey.SEEDED_INITIAL_PURCHASE,
      true,
    );
    this.logger.log('SEEDED INITIAL PURCHASES');
  }
}
