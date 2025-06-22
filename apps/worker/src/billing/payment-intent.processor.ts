import { BILLING_QUEUE, CreatePaymentIntent } from '@app/shared';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(BILLING_QUEUE)
export class PaymentIntentProcessor {
  private logger = new Logger(PaymentIntentProcessor.name);

  @Process()
  handlePaymentIntent(job: Job<CreatePaymentIntent & { id: number }>) {
    this.logger.debug(`Processing job: ${job.data.id}`);

    const param = 40;

    const start1 = Date.now();
    const fibResult1 = this.slowFib(param);
    const dur1 = Date.now() - start1;

    this.logger.debug(
      `Fib(${param}) = ${fibResult1} computed in ${dur1}ms for job ${job.data.id}`,
    );

    this.logger.debug(`Payment intent job ${job.data.id} completed`);
    this.logger.debug(job.data);
  }

  private slowFib(n: number): number {
    return n < 2 ? n : this.slowFib(n - 1) + this.slowFib(n - 2);
  }
}
