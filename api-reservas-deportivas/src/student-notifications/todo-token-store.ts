// PARTE 1 DE 2 PARA PROGRAMAR — dónde viven los tokens de Expo de cada usuario.
// Leé docs/NOTIFICATIONS.md. Cuando funcione, `pnpm test:notificaciones` tiene que pasar.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  AlmacenTokensPush,
  type Plataforma,
} from '../common/notifications/ports.js';
import { DispositivoEntidad } from './device.entity.js';

@Injectable()
export class AlmacenTokensPorHacer extends AlmacenTokensPush {
  constructor(
    @InjectRepository(DispositivoEntidad)
    private readonly repo: Repository<DispositivoEntidad>,
  ) {
    super();
  }

  async guardar(
    usuarioId: string,
    tokenExpo: string,
    plataforma: Plataforma,
  ): Promise<void> {
    await this.repo.upsert({ tokenExpo, usuarioId, plataforma }, ['tokenExpo']);
  }

  async borrar(tokenExpo: string): Promise<void> {
    await this.repo.delete({ tokenExpo });
  }

  async tokensDe(usuarioIds: string[]): Promise<string[]> {
    if (usuarioIds.length === 0) return [];
    const filas = await this.repo.find({ where: { usuarioId: In(usuarioIds) } });
    return filas.map((f) => f.tokenExpo);
  }

  async descartar(tokens: string[]): Promise<void> {
    if (tokens.length === 0) return;
    await this.repo.delete({ tokenExpo: In(tokens) });
  }
}
