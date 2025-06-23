import { BILLING_QUEUE, CreateFibonacciCalc } from '@app/shared';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: +process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
});

@Processor(BILLING_QUEUE)
export class FibonacciCalcProcessor {
  private readonly logger = new Logger(FibonacciCalcProcessor.name);

  @Process()
  async handle(job: Job<CreateFibonacciCalc>) {
    await this.publishStatus(job.id, 'active');

    const fib = this.slowFib(job.data.number || 40);

    await this.publishStatus(job.id, 'completed');
    return fib;
  }

  private slowFib(n: number): number {
    return n < 2 ? n : this.slowFib(n - 1) + this.slowFib(n - 2);
  }

  private async publishStatus(id: string | number, status: string) {
    await redis.publish('job-status', JSON.stringify({ id, status }));
    this.logger.debug(`Job ${id} => ${status}`);
  }
}
