"use server";

import { prisma } from "@/lib/prisma";
import { requireClient, requireAdmin } from "@/lib/authGuard";
import type { ActionResultSimple } from "@/types/common";

/**
 * Server action to mark a message as read
 * Works for both clients and admins
 * 
 * IMPLEMENTATION STEPS:
 * 
 * 1. Validar autenticación:
 *    - Intentar requireClient() primero
 *    - Si falla, intentar requireAdmin()
 *    - Si ambos fallan, retornar error de autorización
 * 
 * 2. Verificar que el mensaje existe:
 *    - Buscar ProjectMessage por messageId
 *    - Si no existe, retornar error
 * 
 * 3. Verificar acceso al mensaje:
 *    - Obtener el Payment relacionado al mensaje
 *    - Si es cliente: verificar que payment.clientId coincida con el clientId del usuario
 *    - Si es admin: no necesita verificación adicional
 *    - Si no tiene acceso, retornar error
 * 
 * 4. Verificar que el mensaje no está ya leído (opcional):
 *    - Si isRead ya es true, retornar success sin hacer nada
 * 
 * 5. Actualizar el mensaje:
 *    - Actualizar ProjectMessage donde id = messageId
 *    - Establecer isRead = true
 *    - Establecer readAt = new Date()
 * 
 * 6. Retornar resultado:
 *    - Si todo es exitoso, retornar { success: true }
 *    - Si hay error, retornar { success: false, error: string }
 * 
 * NOTAS:
 * - Esta acción puede ser llamada automáticamente cuando se obtienen los mensajes
 * - O puede ser llamada explícitamente cuando el usuario abre/ve un mensaje
 * - Considerar hacer bulk update para marcar múltiples mensajes como leídos
 */
export async function markMessageAsReadAction(
  messageId: string
): Promise<ActionResultSimple> {
  // TODO: Implementar lógica aquí
  return {
    success: false,
    error: "Not implemented",
  };
}
