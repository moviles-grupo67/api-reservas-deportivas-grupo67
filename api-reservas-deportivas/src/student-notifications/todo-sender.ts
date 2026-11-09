// PARTE 2 DE 2 PARA PROGRAMAR — cómo se mandan las push a Expo.
// Leé docs/NOTIFICATIONS.md. Cuando funcione, `pnpm test:notificaciones` tiene que pasar.
import { ErrorApi } from '../common/errors/error-api.js';
import {
  EnviadorPush,
  type MensajePush,
} from '../common/notifications/ports.js';

interface TicketExpo {
  status: 'ok' | 'error';
  id?: string;
  details?: { error?: string };
}

const TAMANO_TANDA = 100;

export class EnviadorPorHacer extends EnviadorPush {
  /** `url` es la dirección de la API de push de Expo (`EXPO_PUSH_URL` en la configuración). */
  constructor(readonly url: string) {
    super();
  }

  async enviar(mensajes: MensajePush[]): Promise<{ tokensInvalidos: string[] }> {
    // Un mensaje por token: "aplanamos" la lista de MensajePush (que agrupa varios
    // tokens) a una lista de mensajes individuales, en el formato que espera Expo.
    const porToken = mensajes.flatMap((m) =>
      m.tokens.map((to) => ({
        to,
        title: m.titulo,
        body: m.cuerpo,
        data: m.datos,
      })),
    );

    const tokensInvalidos: string[] = [];

    for (let i = 0; i < porToken.length; i += TAMANO_TANDA) {
      const tanda = porToken.slice(i, i + TAMANO_TANDA);
      const respuesta = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tanda),
      });

      if (!respuesta.ok) {
        throw new ErrorApi(
          'NO_IMPLEMENTADO',
          `Expo respondió ${respuesta.status} al mandar las push.`,
        );
      }

      const { data: tickets } = (await respuesta.json()) as { data: TicketExpo[] };
      tickets.forEach((ticket, indice) => {
        if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
          tokensInvalidos.push(tanda[indice].to);
        }
      });
    }

    return { tokensInvalidos };
  }
}
