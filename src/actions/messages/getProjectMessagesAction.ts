"use server";

import { prisma } from "@/lib/prisma";
import { requireClient, requireAdmin } from "@/lib/authGuard";
import type { ClientMessage, AdminMessage } from "@/types/message";
import type { ActionResult } from "@/types/common";

/**
 * Server action to get messages for a project
 * Works for both clients and admins
 *
 * IMPLEMENTATION STEPS:
 *
 * 1. Validar autenticación:
 *    - Intentar requireClient() primero
 *    - Si falla, intentar requireAdmin()
 *    - Si ambos fallan, retornar error de autorización
 *
 * 2. Verificar acceso al proyecto:
 *    - Buscar el Payment por projectCode
 *    - Si es cliente: verificar que payment.clientId coincida con el clientId del usuario
 *    - Si es admin: no necesita verificación adicional (puede ver todos los proyectos)
 *    - Si no tiene acceso, retornar error
 *
 * 3. Obtener mensajes de la base de datos:
 *    - Buscar todos los ProjectMessage donde paymentId = payment.id
 *    - Incluir attachments (ProjectMessageAttachment)
 *    - Ordenar por createdAt ASC (más antiguos primero)
 *
 * 4. Mapear mensajes según el tipo de usuario:
 *    - Si es cliente: mapear a ClientMessage[]
 *      - Incluir todos los campos necesarios
 *      - Convertir fechas a ISO strings
 *      - Incluir attachments mapeados
 *    - Si es admin: mapear a AdminMessage[]
 *      - Incluir información adicional del proyecto (projectCode, planName, clientName, clientEmail)
 *      - Calcular unreadCount: contar mensajes donde senderType = "client" y isRead = false
 *      - Incluir attachments mapeados
 *
 * 5. (Opcional) Marcar mensajes como leídos:
 *    - Si es cliente: marcar todos los mensajes donde senderType = "admin" y isRead = false
 *    - Si es admin: marcar todos los mensajes donde senderType = "client" y isRead = false
 *    - Actualizar isRead = true y readAt = new Date()
 *    - Esto puede hacerse en una transacción separada o en el mismo query
 *
 * 6. Retornar resultado:
 *    - Si es cliente: retornar { success: true, data: { messages: ClientMessage[] } }
 *    - Si es admin: retornar { success: true, data: { messages: AdminMessage[] } }
 *    - Si hay error, retornar { success: false, error: string }
 *
 * NOTAS:
 * - Considerar paginación si hay muchos mensajes (ej: últimos 50)
 * - El orden ASC permite mostrar la conversación cronológicamente
 * - Marcar como leído puede ser opcional o hacerse en una acción separada
 */
export async function getProjectMessagesAction(
  projectCode: string
): Promise<ActionResult<{ messages: ClientMessage[] | AdminMessage[] }>> {
  // TODO: Implementar lógica aquí
  return {
    success: false,
    error: "Not implemented",
  };
}
