import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericError, NotFoundError } from 'src/errors';
import { ConflictError } from 'src/errors/conflict.error';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { AppConfigService } from 'src/app-configs/app-config.service';
import { AppConfigKey } from 'src/app-configs/app-config.constant';

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService');
  constructor(
    @InjectModel(User.name) readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async onModuleInit() {
    await this.createInitialAdmin();
  }

  async createUser(dto: CreateUserDto) {
    const exists = await this.userModel.exists({
      email: dto.email?.toLowerCase(),
    });
    if (exists) {
      throw new ConflictError('', '', '', 'Email is already taken');
    }
    const newUser = new this.userModel(dto);
    await newUser.save();
    return newUser;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email?.toLowerCase() });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async updateUser(id: string, dto: EditUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto);
    if (!updatedUser) {
      throw new NotFoundError('User', 'id', id);
    }
    return updatedUser;
  }

  async findByTempToken(token: string) {
    return this.userModel.findOne({ tempLoginToken: token });
  }

  async getAllUsers() {
    return this.userModel.find();
  }

  async toggleUserAdminRole(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User', 'id', userId);
    }
    user.is_admin = !user.is_admin;
    await user.save();
    return user;
  }

  async createInitialAdmin() {
    const config = await this.appConfigService.getConfig(
      AppConfigKey.SEEDED_INITIAL_ADMIN,
    );

    if (config && config.value == true) return;

    const initialAdminEmail = this.configService.get<string>(
      'INITIAL_ADMIN_EMAIL',
      '',
    );
    const initialAdminFullName = this.configService.get<string>(
      'INITIAL_ADMIN_FULL_NAME',
      '',
    );
    if (!initialAdminEmail) {
      throw new GenericError(
        'Please Provide initial Admin Email in env config "INITIAL_ADMIN_EMAIL"',
      );
    }
    if (!initialAdminFullName) {
      throw new GenericError(
        'Please Provide initial Admin Full Name in env config "INITIAL_ADMIN_FULL_NAME',
      );
    }

    const existingAdmin = await this.findByEmail(initialAdminEmail);

    if (existingAdmin) {
      if (!existingAdmin.is_admin) {
        existingAdmin.is_admin = true;
        await existingAdmin.save();
      }
      await this.appConfigService.setConfig(
        AppConfigKey.SEEDED_INITIAL_ADMIN,
        true,
      );

      return;
    }

    const [first_name, last_name] = initialAdminFullName.split(' ');

    await this.createUser({
      first_name,
      last_name,
      email: initialAdminEmail,
    });

    this.logger.log('INITIAL ADMIN ACCOUNT CREATED');
  }
}
