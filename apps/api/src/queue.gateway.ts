import { REDIS_CLIENT } from '@app/shared';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import Redis from 'ioredis';
import * as os from 'os';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/queue',
})
export class QueueGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(QueueGateway.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redisSub: Redis) {}

  async onModuleInit() {
    await this.redisSub.subscribe('job-status');

    this.redisSub.on('message', (_channel, message) => {
      try {
        const data = JSON.parse(message) as unknown;
        this.server.emit('jobStatus', data);
        this.logger.debug(`Emitido jobStatus: ${message}`);
      } catch (err) {
        this.logger.error('Erro ao parsear job-status', err);
      }
    });

    this.startEmittingSystemStatus();
  }

  private startEmittingSystemStatus(): void {
    setInterval(() => {
      const memory = process.memoryUsage();
      const cpus = os.loadavg();

      this.server.emit('systemStatus', {
        memory,
        cpu1min: cpus[0],
        cpu5min: cpus[1],
        cpu15min: cpus[2],
      });
    }, 2000);

    this.logger.log('Started emitting systemStatus every 2s');
  }
}
