import { EventEmitterModuleOptions } from '@nestjs/event-emitter/dist/interfaces';

export const EventEmitterOptions: EventEmitterModuleOptions = {
  global: true,
  delimiter: '.',
};
