"use server";

import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/authGuard";
import { sendNewClientMessageEmail } from "@/lib/email/senders";
import type { CreateMessageData } from "@/types/message";
import type { ActionResult } from "@/types/common";

/**
 * Server action for clients to send messages to admin
 * 
 * IMPLEMENTATION STEPS:
 * 
 * 1. Validar autenticación del cliente:
 *    - Usar requireClient() para verificar que el usuario está autenticado como cliente
 *    - Si no está autorizado, retornar error
 * 
 * 2. Verificar acceso al proyecto:
 *    - Buscar el Payment por paymentId
 *    - Verificar que el payment.clientId coincida con el clientId del usuario autenticado
 *    - Si no existe o no tiene acceso, retornar error
 * 
 * 3. Validar datos del mensaje:
 *    - Verificar que message no esté vacío (trim y length > 0)
 *    - Validar longitud máxima del mensaje (ej: 5000 caracteres)
 *    - Si hay attachments, validar que no excedan límites (ej: 5 archivos, 10MB total)
 * 
 * 4. Crear el mensaje en la base de datos:
 *    - Crear ProjectMessage con:
 *      - paymentId
 *      - message (trimmed)
 *      - senderType: "client"
 *      - senderEmail: email del cliente autenticado
 *      - senderName: nombre del cliente
 *      - isRead: false
 *    - Si hay attachments, crear ProjectMessageAttachment para cada uno
 * 
 * 5. Obtener información del proyecto para el email:
 *    - Obtener payment con información del proyecto (projectCode, planName, etc.)
 *    - Obtener email del admin (puede ser una variable de entorno o buscar en la BD)
 * 
 * 6. Enviar email de notificación al admin:
 *    - Usar sendNewClientMessageEmail con:
 *      - adminEmail: email del admin
 *      - clientName: nombre del cliente
 *      - clientEmail: email del cliente
 *      - projectCode: código del proyecto
 *      - planName: nombre del plan
 *      - message: contenido del mensaje
 *      - adminPanelUrl: URL del admin panel con link directo al proyecto/mensajes
 *    - Si falla el email, registrar error pero no fallar la acción (el mensaje ya se guardó)
 * 
 * 7. Retornar resultado:
 *    - Si todo es exitoso, retornar { success: true, data: { messageId: string } }
 *    - Si hay error, retornar { success: false, error: string }
 * 
 * NOTAS:
 * - El email debe enviarse de forma asíncrona (no bloquear la respuesta)
 * - Considerar manejar errores de email sin afectar la creación del mensaje
 * - Validar que el proyecto no esté completado si quieres restringir mensajes post-completion
 */
export async function sendClientMessageAction(
  data: CreateMessageData
): Promise<ActionResult<{ messageId: string }>> {
  // TODO: Implementar lógica aquí
  return {
    success: false,
    error: "Not implemented",
  };
}
