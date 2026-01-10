"use client";

import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { getProjectMessagesAction } from "@/actions/messages/getProjectMessagesAction";
import { sendClientMessageAction } from "@/actions/messages/sendClientMessageAction";
import { formatDate } from "@/lib/utils";
import type { ClientMessage } from "@/types/message";

interface ClientMessagesProps {
  projectCode: string;
  paymentId: string;
}

/**
 * Component for clients to view and send messages about their project
 * 
 * IMPLEMENTATION STEPS:
 * 
 * 1. Estados necesarios:
 *    - messages: ClientMessage[] - Lista de mensajes
 *    - messageText: string - Texto del mensaje que se está escribiendo
 *    - isSending: boolean - Estado de carga al enviar mensaje
 *    - isLoading: boolean - Estado de carga al obtener mensajes
 *    - Use useRef para el contenedor de mensajes (para scroll automático)
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
 *    - Llamar sendClientMessageAction con:
 *      - paymentId
 *      - message: messageText (trimmed)
 *      - senderType: "client"
 *    - Si es exitoso:
 *      - Limpiar messageText
 *      - Recargar mensajes (llamar getProjectMessagesAction nuevamente)
 *      - Mostrar toast de éxito
 *      - Hacer scroll al final del contenedor
 *    - Si hay error, mostrar toast de error
 *    - Finalmente, establecer isSending = false
 * 
 * 4. Función para scroll automático:
 *    - Usar useEffect que se ejecute cuando messages cambie
 *    - Hacer scroll al final del contenedor usando el ref
 *    - Usar scrollIntoView o scrollTop
 * 
 * 5. Renderizar mensajes:
 *    - Mapear messages y mostrar cada uno
 *    - Diferenciar visualmente mensajes del cliente vs admin:
 *      - Cliente: alineados a la derecha, color diferente (ej: azul/dorado)
 *      - Admin: alineados a la izquierda, color diferente (ej: gris)
 *    - Mostrar nombre del remitente, fecha, y contenido del mensaje
 *    - Mostrar indicador de "no leído" si aplica
 *    - Si hay attachments, mostrar links para descargar
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
 *    - Indicador de "typing..." si el admin está escribiendo (requiere WebSockets)
 * 
 * NOTAS:
 * - Usar Tailwind CSS para estilos consistentes con el resto de la app
 * - Seguir el patrón de diseño de ClientDeliverables
 * - Considerar límite de caracteres visible en el textarea
 */
export default function ClientMessages({
  projectCode,
  paymentId,
}: ClientMessagesProps) {
  // TODO: Implementar estados y lógica aquí

  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
        Project Messages
      </h3>
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-6">
        {/* TODO: Implementar UI aquí */}
        <p className="text-gray-400 text-sm">Messages component - To be implemented</p>
      </div>
    </div>
  );
}
