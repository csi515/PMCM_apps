import { Module } from '@nestjs/common';
import { GtmService } from './gtm.service';
import { GtmController } from './gtm.controller';

@Module({
  controllers: [GtmController],
  providers: [GtmService],
})
export class GtmModule {}
