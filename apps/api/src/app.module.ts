import { BILLING_QUEUE, SharedModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueueGateway } from './queue.gateway';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: BILLING_QUEUE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, QueueGateway],
})
export class AppModule {}
