import { BILLING_QUEUE, SharedModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FibonacciCalcProcessor } from './billing/fibonacci-calc.processor';
import { QueueMonitorService } from './queue-monitor.service';

@Module({
  imports: [SharedModule, BullModule.registerQueue({ name: BILLING_QUEUE })],
  providers: [FibonacciCalcProcessor, QueueMonitorService],
})
export class WorkerModule {}
