import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { AtmService } from './atm.service';
import { WithdrawResult } from './interfaces/withdraw-result.interface'

@Controller('atm')
export class AtmController {
  constructor(private readonly _atmService: AtmService) { }

  @Get('/withdraw/:amount')
  @HttpCode(200)
  withdraw(@Param('amount') amount: number): WithdrawResult {
    return this._atmService.withdrawAmount(amount)
  }
}
