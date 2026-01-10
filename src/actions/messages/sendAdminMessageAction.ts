"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { auth } from "@/lib/auth";
import { sendNewAdminMessageEmail } from "@/lib/email/senders";
import type { CreateMessageData } from "@/types/message";
import type { ActionResult } from "@/types/common";

/**
 * Server action for admin to send messages to clients
 * 
 * IMPLEMENTATION STEPS:
 * 
 * 1. Validar autenticación del admin:
 *    - Usar requireAdmin() para verificar que el usuario está autenticado como admin
 *    - Si no está autorizado, retornar error
 * 
 * 2. Verificar que el proyecto existe:
 *    - Buscar el Payment por paymentId
 *    - Si no existe, retornar error
 * 
 * 3. Validar datos del mensaje:
 *    - Verificar que message no esté vacío (trim y length > 0)
 *    - Validar longitud máxima del mensaje (ej: 5000 caracteres)
 *    - Si hay attachments, validar que no excedan límites (ej: 5 archivos, 10MB total)
 * 
 * 4. Obtener información del admin:
 *    - Usar auth() para obtener la sesión
 *    - Obtener email y nombre del admin desde session.user
 * 
 * 5. Crear el mensaje en la base de datos:
 *    - Crear ProjectMessage con:
 *      - paymentId
 *      - message (trimmed)
 *      - senderType: "admin"
 *      - senderEmail: email del admin
 *      - senderName: nombre del admin (o "RC Web Solutions" como default)
 *      - isRead: false
 *    - Si hay attachments, crear ProjectMessageAttachment para cada uno
 * 
 * 6. Obtener información del cliente para el email:
 *    - Obtener payment con información del cliente (email, name, projectCode, planName)
 * 
 * 7. Enviar email de notificación al cliente:
 *    - Usar sendNewAdminMessageEmail con:
 *      - customerEmail: email del cliente
 *      - customerName: nombre del cliente
 *      - projectCode: código del proyecto
 *      - planName: nombre del plan
 *      - message: contenido del mensaje
 *      - clientPortalUrl: URL del portal del cliente con link directo a los mensajes
 *    - Si falla el email, registrar error pero no fallar la acción (el mensaje ya se guardó)
 * 
 * 8. Retornar resultado:
 *    - Si todo es exitoso, retornar { success: true, data: { messageId: string } }
 *    - Si hay error, retornar { success: false, error: string }
 * 
 * NOTAS:
 * - El email debe enviarse de forma asíncrona (no bloquear la respuesta)
 * - Considerar manejar errores de email sin afectar la creación del mensaje
 * - El admin puede responder a cualquier proyecto, no necesita verificación de acceso
 */
export async function sendAdminMessageAction(
  data: CreateMessageData
): Promise<ActionResult<{ messageId: string }>> {
  // TODO: Implementar lógica aquí
  return {
    success: false,
    error: "Not implemented",
  };
}
