import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ServicePublicService } from './service-public.service';

@Controller('public')
export class ServicePublicController {
  constructor(private readonly service: ServicePublicService) {}

  @Get('technician-profile')
  getAllTechnicians() {
    return this.service.getAllTechniciansPublic();
  }

  @Get('technician-profile/:id')
  getTechnicianProfile(@Param('id', ParseIntPipe) id: number) {
    return this.service.getTechnicianProfilePublic(id);
  }

  @Get('request/:id')
  getRequestPublic(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRequestPublicById(id);
  }
}
