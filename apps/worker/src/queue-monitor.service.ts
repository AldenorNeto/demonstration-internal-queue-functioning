import { CALC_QUEUE } from '@app/shared';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class QueueMonitorService implements OnModuleInit {
  private readonly logger = new Logger(QueueMonitorService.name);
  private readonly pub = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  });

  constructor(@InjectQueue(CALC_QUEUE) private readonly queue: Queue) {}

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
