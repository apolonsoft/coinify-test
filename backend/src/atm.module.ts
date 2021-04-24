import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AtmController } from './atm.controller';
import { AtmService } from './atm.service';

@Module({
  imports: [ConfigModule],
  controllers: [AtmController],
  providers: [AtmService],
})
export class AtmModule {}
