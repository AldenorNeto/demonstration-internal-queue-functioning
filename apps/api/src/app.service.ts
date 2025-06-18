import { BILLING_QUEUE, CreatePaymentIntent } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  private id = 1;

  constructor(
    @InjectQueue(BILLING_QUEUE) private readonly billingQueue: Queue,
  ) {}

  async handlePaymentIntent(body: CreatePaymentIntent) {
    await this.billingQueue.add({ ...body, id: this.id });

    this.id++;
  }
}
