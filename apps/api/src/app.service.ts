import { BILLING_QUEUE, CreateFibonacciCalc } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
  ) {}

  async handleFibonacciCalc(body: CreateFibonacciCalc) {
    const job = await this.billingQueue.add(body);
    return { jobId: job.id };
  }
}
