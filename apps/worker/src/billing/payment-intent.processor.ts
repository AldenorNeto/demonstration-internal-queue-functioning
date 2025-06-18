import { BILLING_QUEUE, CreatePaymentIntent } from '@app/shared';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor(BILLING_QUEUE)
export class PaymentIntentProcessor {
  private logger = new Logger(PaymentIntentProcessor.name);

  @Process()
  async handlePaymentIntent(job: Job<CreatePaymentIntent & { id: number }>) {
    this.logger.debug(`Processing job: ${job.data.id}`);
    await this.awaitDelay(2000);

    this.logger.debug(
      `Payment intent job processed job id : ${job.data.id} amount: ${job.data.amount}`,
    );
    await this.awaitDelay(5000);

    this.logger.debug(`Payment intent job ${job.data.id} completed`);
    this.logger.debug(job.data);
  }

  private async awaitDelay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
