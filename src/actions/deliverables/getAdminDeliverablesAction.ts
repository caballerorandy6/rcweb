"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { AdminDeliverable } from "@/types/deliverable";
import type { ActionResult } from "@/types/common";

/**
 * Obtiene todos los deliverables de un payment para el admin
 *
 * INSTRUCCIONES PARA IMPLEMENTAR:
 *
 * 1. Verificar autorización de admin:
 *    - Usar requireAdmin()
 *    - Si !auth.authorized, retornar { success: false, error: auth.error || "Unauthorized" }
 *
 * 2. Validar paymentId:
 *    - Verificar que paymentId no esté vacío
 *    - Si está vacío, retornar error
 *
 * 3. Buscar el Payment con sus relaciones:
 *    - Usar prisma.payment.findUnique con:
 *      - where: { id: paymentId }
 *      - include: {
 *          client: true,  // Para obtener datos del cliente si existe
 *          deliverables: true  // Para obtener todos los deliverables
 *        }
 *    - Si no existe el payment, retornar error "Payment not found"
 *
 * 4. Mapear los deliverables a AdminDeliverable[]:
 *    - Para cada deliverable en payment.deliverables:
 *      - id: deliverable.id
 *      - paymentId: paymentId
 *      - projectCode: payment.projectCode
 *      - planName: payment.planName
 *      - clientName: payment.client?.name || payment.name
 *        (Si existe client registrado, usar client.name, sino payment.name)
 *      - clientEmail: payment.client?.email || payment.email
 *        (Si existe client registrado, usar client.email, sino payment.email)
 *      - name: deliverable.name
 *      - description: deliverable.description
 *      - type: deliverable.type
 *      - fileUrl: deliverable.fileUrl
 *      - blobKey: deliverable.blobKey
 *      - fileSize: deliverable.fileSize
 *      - mimeType: deliverable.mimeType
 *      - uploadedBy: deliverable.uploadedBy
 *      - createdAt: deliverable.createdAt.toISOString()
 *      - updatedAt: deliverable.updatedAt.toISOString()
 *
 * 5. Ordenar los deliverables:
 *    - Ordenar por createdAt descendente (más recientes primero)
 *    - Puedes hacerlo en el query con orderBy o después con sort()
 *
 * 6. Retornar resultado:
 *    - Si todo está bien: { success: true, data: { deliverables: mappedDeliverables } }
 *    - Si hay error: { success: false, error: "mensaje de error" }
 *
 * 7. Manejar errores:
 *    - Usar try/catch
 *    - En el catch, loggear el error y retornar error genérico
 *
 * EJEMPLO DE ESTRUCTURA:
 */
export async function getAdminDeliverablesAction(
  paymentId: string
): Promise<ActionResult<{ deliverables: AdminDeliverable[] }>> {
  const admin = await requireAdmin();
  if (!admin.authorized) {
    return {
      success: false,
      error: admin.error,
    };
  }

  if (!paymentId || typeof paymentId !== "string" || paymentId.trim() === "") {
    return {
      success: false,
      error: "Payment ID is required",
    };
  }

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      client: true,
      deliverables: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!payment) {
    return {
      success: false,
      error: "Payment not found",
    };
  }

  try {
    // 5. Mapear deliverables y ordenar por createdAt descendente
    const mappedDeliverables: AdminDeliverable[] = payment.deliverables
      .map((d) => ({
        id: d.id,
        paymentId: paymentId,
        projectCode: payment.projectCode,
        planName: payment.planName,
        clientName: payment.client?.name || payment.name,
        clientEmail: payment.client?.email || payment.email,
        name: d.name,
        description: d.description,
        type: d.type,
        fileUrl: d.fileUrl,
        blobKey: d.blobKey,
        fileSize: d.fileSize,
        mimeType: d.mimeType,
        uploadedBy: d.uploadedBy,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // 6. Retornar resultado
    return {
      success: true,
      data: {
        deliverables: mappedDeliverables,
      },
    };
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    return {
      success: false,
      error: "Failed to fetch deliverables",
    };
  }
}
