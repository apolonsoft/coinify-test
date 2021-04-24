import { Controller, Get } from '@nestjs/common';
import { AtmService } from './atm.service';

@Controller()
export class AtmController {
  constructor(private readonly atmService: AtmService) {}

}
