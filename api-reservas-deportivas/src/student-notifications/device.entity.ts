import { Entity, PrimaryColumn } from 'typeorm';
import { ColumnaRef, ColumnaEnum } from '../common/db/columns.js';

@Entity('dispositivos')
export class DispositivoEntidad {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  tokenExpo: string;

  @ColumnaRef({ nullable: false })
  usuarioId: string;

  @ColumnaEnum()
  plataforma: 'ios' | 'android';
}