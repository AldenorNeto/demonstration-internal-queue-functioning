import { CreateFibonacciCalc } from '@app/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('fibonacci')
  async createJob(@Body() body: CreateFibonacciCalc) {
    return this.appService.handleFibonacciCalc(body);
  }
}
