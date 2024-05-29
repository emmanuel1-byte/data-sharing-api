import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public';

/**
 * Provides a health check endpoint that returns the status and a success message.
 * This endpoint can be used to verify that the application is running and responding correctly.
 */
@Controller('/')
export class HealthController {
  @Public()
  @Get('/')
  getHealth() {
    return { status: 'Ok', message: 'Health check successfull!' };
  }
}
