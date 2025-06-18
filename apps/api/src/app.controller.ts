import { CreatePaymentIntent } from '@app/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('payment-intent')
  async handlePaymentIntent(@Body() body: CreatePaymentIntent) {
    return await this.appService.handlePaymentIntent(body);
  }
}
