import { CALC_QUEUE, REDIS_CLIENT } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class QueueMonitorService implements OnModuleInit {
  private readonly logger = new Logger(QueueMonitorService.name);

  constructor(
    @InjectQueue(CALC_QUEUE) private readonly queue: Queue,
    @Inject(REDIS_CLIENT) private readonly pub: Redis,
  ) {}

  onModuleInit() {
    this.logger.log('Inicializando monitor de fila no Worker');

    this.queue.on('waiting', () => void this.handleQueueEvent('waiting'));
    this.queue.on('active', () => void this.handleQueueEvent('active'));
    this.queue.on('completed', () => void this.handleQueueEvent('completed'));
    this.queue.on('failed', () => void this.handleQueueEvent('failed'));
  }

  private async handleQueueEvent(event: string) {
    const status = await this.queue.getJobCounts();
    await this.pub.publish('queue:status', JSON.stringify(status));
    this.logger.debug(`Evento ${event} publicado: ${JSON.stringify(status)}`);
  }
}
