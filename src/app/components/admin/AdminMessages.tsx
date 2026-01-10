"use client";

import { useState, useEffect } from "react";
import { PaperAirplaneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { getProjectMessagesAction } from "@/actions/messages/getProjectMessagesAction";
import { sendAdminMessageAction } from "@/actions/messages/sendAdminMessageAction";
import { formatDate } from "@/lib/utils";
import type { AdminMessage } from "@/types/message";

interface AdminMessagesProps {
  paymentId: string;
  projectCode: string;
  planName: string;
  clientName: string;
  clientEmail: string;
}

/**
 * Component for admin to view and send messages to clients
 * 
 * IMPLEMENTATION STEPS:
 * 
 * 1. Estados necesarios:
 *    - messages: AdminMessage[] - Lista de mensajes
 *    - messageText: string - Texto del mensaje que se está escribiendo
 *    - isSending: boolean - Estado de carga al enviar mensaje
 *    - isLoading: boolean - Estado de carga al obtener mensajes
 * 
 * 2. useEffect para cargar mensajes:
 *    - Al montar el componente, llamar getProjectMessagesAction(projectCode)
 *    - Si es exitoso, actualizar el estado messages
 *    - Si hay error, mostrar toast de error
 *    - Opcional: configurar polling cada X segundos para nuevos mensajes
 * 
 * 3. Función handleSendMessage:
 *    - Validar que messageText no esté vacío (trim)
 *    - Establecer isSending = true
 *    - Llamar sendAdminMessageAction con:
 *      - paymentId
 *      - message: messageText (trimmed)
 *      - senderType: "admin"
 *    - Si es exitoso:
 *      - Limpiar messageText
 *      - Recargar mensajes (llamar getProjectMessagesAction nuevamente)
 *      - Mostrar toast de éxito
 *    - Si hay error, mostrar toast de error
 *    - Finalmente, establecer isSending = false
 * 
 * 4. Renderizar mensajes:
 *    - Mapear messages y mostrar cada uno
 *    - Diferenciar visualmente mensajes del cliente vs admin:
 *      - Cliente: alineados a la izquierda, color diferente (ej: azul)
 *      - Admin: alineados a la derecha, color diferente (ej: dorado/gris)
 *    - Mostrar nombre del remitente, fecha, y contenido del mensaje
 *    - Mostrar badge de "unread" si el mensaje no está leído
 *    - Si hay attachments, mostrar links para descargar
 * 
 * 5. Información del proyecto:
 *    - Mostrar header con información del proyecto:
 *      - Project Code
 *      - Client Name y Email
 *      - Plan Name
 *      - Badge con contador de mensajes no leídos (unreadCount)
 * 
 * 6. Input de mensaje:
 *    - Textarea para escribir el mensaje
 *    - Botón de envío con icono PaperAirplaneIcon
 *    - Deshabilitar botón si messageText está vacío o isSending es true
 *    - Mostrar estado de carga en el botón
 * 
 * 7. Estados vacíos:
 *    - Si no hay mensajes, mostrar mensaje "No messages yet. Start the conversation!"
 * 
 * 8. Responsive design:
 *    - Asegurar que funcione bien en mobile y desktop
 *    - El contenedor de mensajes debe tener altura fija y scroll
 *    - El input debe estar fijo en la parte inferior
 * 
 * 9. Mejoras opcionales:
 *    - Auto-focus en el textarea al montar
 *    - Enviar mensaje con Enter (Shift+Enter para nueva línea)
 *    - Mostrar timestamp relativo (ej: "2 minutes ago")
 *    - Botón para marcar todos como leídos
 *    - Filtro para mostrar solo no leídos
 * 
 * NOTAS:
 * - Usar Tailwind CSS para estilos consistentes con el resto de la app
 * - Seguir el patrón de diseño de AdminDeliverables
 * - Considerar límite de caracteres visible en el textarea
 * - El componente puede usarse en un modal o página completa
 */
export default function AdminMessages({
  paymentId,
  projectCode,
  planName,
  clientName,
  clientEmail,
}: AdminMessagesProps) {
  // TODO: Implementar estados y lógica aquí

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
          Messages - {projectCode}
        </h3>
        {/* TODO: Mostrar información del proyecto y contador de no leídos */}
      </div>

      {/* Messages Container */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-6">
        {/* TODO: Implementar UI de mensajes aquí */}
        <p className="text-gray-400 text-sm">Messages component - To be implemented</p>
      </div>
    </div>
  );
}
