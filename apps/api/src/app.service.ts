import { CALC_QUEUE, CreateFibonacciCalc } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue(CALC_QUEUE) private readonly fiboQueue: Queue) {}

  async handleFibonacciCalc(body: CreateFibonacciCalc) {
    const job = await this.fiboQueue.add(body);

    return { jobId: job.id, status: 'waiting' };
  }
}
