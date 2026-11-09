import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuracion } from '../../config/environment.js';
import { AlmacenTokensPorHacer } from '../../student-notifications/todo-token-store.js';
import { DispositivoEntidad } from '../../student-notifications/device.entity.js';
import { EnviadorPorHacer } from '../../student-notifications/todo-sender.js';
import { Avisos } from './notices.service.js';
import { DispositivosControlador } from './devices.controller.js';
import { EnviadorRegistro } from './registry-sender.js';

import { AlmacenTokensPush, EnviadorPush } from './ports.js';


@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DispositivoEntidad])],
  controllers: [DispositivosControlador],
  providers: [
    { provide: AlmacenTokensPush, useClass: AlmacenTokensPorHacer },
    {
      provide: EnviadorPush,
      inject: [Configuracion],
      useFactory: (config: Configuracion): EnviadorPush =>
        config.notificaciones === 'expo'
          ? new EnviadorPorHacer(config.expoPushUrl)
          : new EnviadorRegistro(),
    },
    Avisos,
  ],
  exports: [Avisos],
})
export class NotificacionesModulo {}
