import { CALC_QUEUE, CreateFibonacciCalc, REDIS_CLIENT } from '@app/shared';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import Redis from 'ioredis';

@Processor(CALC_QUEUE)
export class FibonacciCalcProcessor {
  private readonly logger = new Logger(FibonacciCalcProcessor.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  @Process()
  async handle(job: Job<CreateFibonacciCalc>) {
    await this.publishStatus(job.id, 'active');

    const fib = this.slowFib(job.data.number || 0);

    await this.publishStatus(job.id, 'completed', fib);
    return fib;
  }

  private slowFib(n: number): number {
    return n < 2 ? n : this.slowFib(n - 1) + this.slowFib(n - 2);
  }

  private async publishStatus(
    id: string | number,
    status: string,
    fib?: number,
  ) {
    await this.redis.publish(
      'job-status',
      JSON.stringify({ id, status, value: fib }),
    );

    this.logger.debug(`Job ${id} ==> ${status}`);
  }
}
