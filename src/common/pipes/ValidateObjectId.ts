import { PipeTransform, Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Types } from 'mongoose';
@Injectable()
export class ValidateObjectId implements PipeTransform<string, string> {
  transform(value: string) {
    if (Types.ObjectId.isValid(value)) return value;
    throw new BadRequestException('Parameter Provided is not a valid Id');
  }
}
