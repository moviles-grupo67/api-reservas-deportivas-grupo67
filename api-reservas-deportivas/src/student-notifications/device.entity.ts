import { Entity } from 'typeorm';
import { ColumnaId, ColumnaRef, ColumnaEnum } from '../common/db/columns.js';

@Entity('dispositivos')
export class DispositivoEntidad {
  @ColumnaId()
  tokenExpo: string;

  @ColumnaRef({ nullable: false })
  usuarioId: string;

  @ColumnaEnum()
  plataforma: 'ios' | 'android';
}
