import { CALC_QUEUE, SharedModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FibonacciCalcProcessor } from './calc/fibonacci-calc.processor';
import { QueueMonitorService } from './queue-monitor.service';

@Module({
  imports: [SharedModule, BullModule.registerQueue({ name: CALC_QUEUE })],
  providers: [FibonacciCalcProcessor, QueueMonitorService],
})
export class WorkerModule {}
