import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import Queues from 'src/common/constants/queues.constants';
import { WorkerHostProcessor } from 'src/common/processors/worker-host.processor';
import { GenericError } from 'src/errors';
import { MailService } from './mail.service';

export const emailJobKeys = {
  INITIATE_LOGIN: 'initiate-login',
};

@Processor(Queues.SendMail)
@Injectable()
export class EmailProcessor extends WorkerHostProcessor {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case emailJobKeys.INITIATE_LOGIN: {
        return await this.mailService.sendLoginEmail(
          job.data.email,
          job.data.token,
          job.data.name,
        );
      }
    }
    throw new GenericError(`Unknown job name: ${job.name}`);
  }
}
