import { CALC_QUEUE, SharedModule } from '@app/shared';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FibonacciCalcProcessor } from './processors/fibonacci-calc.processor';

@Module({
  imports: [SharedModule, BullModule.registerQueue({ name: CALC_QUEUE })],
  providers: [FibonacciCalcProcessor],
})
export class WorkerModule {}
