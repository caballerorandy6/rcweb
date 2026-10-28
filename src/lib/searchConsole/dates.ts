/** Fechas de Search Console: cadenas YYYY-MM-DD y columnas `@db.Date` (medianoche UTC). */

export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** `YYYY-MM-DD` → Date a medianoche UTC, lo que Prisma guarda en una columna `@db.Date`. */
export function parseDateString(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid Search Console date: ${value}`);
  }
  return new Date(`${value}T00:00:00.000Z`);
}

/** Hoy a medianoche UTC. */
export function todayUTC(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

/**
 * Rango que vuelve a pedir cada sincronización: los últimos `days` días
 * terminando ayer (Google no tiene nada de hoy y lo de los últimos 2-3 días
 * llega parcial; al repetir el rango a diario queda corregido).
 */
export function resyncRange(days: number, now = new Date()): { start: Date; end: Date } {
  const end = addDays(todayUTC(now), -1);
  return { start: addDays(end, -(days - 1)), end };
}
