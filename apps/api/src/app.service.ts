import { BILLING_QUEUE, CreatePaymentIntent } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QueueGateway } from './queue.gateway';

@Injectable()
export class AppService {
  private nextId = 1;

  constructor(
    @InjectQueue(BILLING_QUEUE)
    private readonly billingQueue: Queue,
    private readonly queueGateway: QueueGateway,
  ) {}

  async handlePaymentIntent(body: CreatePaymentIntent) {
    await this.billingQueue.add({ ...body, id: this.nextId });
    this.nextId++;

    const counts =
      (await this.billingQueue.getJobCounts()) as unknown as Record<
        string,
        number
      >;

    this.queueGateway.emitQueueStatus(counts);

    // retorna algo ao cliente HTTP, se necessário
    return { enqueued: true, counts };
  }
}
