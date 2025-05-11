import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ServicePublicService } from './service-public.service';

@Controller('public')
export class ServicePublicController {
  constructor(private readonly service: ServicePublicService) {}

  @Get('technician-profile/:id')
  getTechnicianProfile(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTechnicianProfilePublic(id);
  }
}
