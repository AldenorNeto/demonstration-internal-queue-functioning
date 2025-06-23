import { Logger, OnModuleInit } from '@nestjs/common';
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

  private readonly redisSub = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  });

  async onModuleInit() {
    await this.redisSub.subscribe('job-status');

    this.redisSub.on('message', (_channel, message) => {
      try {
        const data = JSON.parse(message); // { id, status }
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
      const mem = process.memoryUsage();
      const cpus = os.loadavg();

      this.server.emit('systemStatus', {
        memory: {
          rss: mem.rss,
          heapUsed: mem.heapUsed,
          heapTotal: mem.heapTotal,
        },
        cpu1min: cpus[0],
        cpu5min: cpus[1],
        cpu15min: cpus[2],
      });
    }, 2000);

    this.logger.log('Started emitting systemStatus every 2s');
  }
}
