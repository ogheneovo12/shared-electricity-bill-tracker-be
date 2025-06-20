import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppConfig, AppConfigDocument } from './app-config.schem';

@Injectable()
export class AppConfigService {
  constructor(
    @InjectModel(AppConfig.name)
    private appConfigModel: Model<AppConfigDocument>,
  ) {}

  async getConfig(name: string) {
    return this.appConfigModel.findOne({ name }).exec();
  }

  async setConfig(name: string, value: any) {
    return this.appConfigModel
      .findOneAndUpdate({ name }, { value }, { upsert: true, new: true })
      .exec();
  }
}
