/**
 * Message types for client and admin views
 */

export type ClientMessage = {
  id: string;
  message: string;
  senderType: "client" | "admin";
  senderName: string;
  senderEmail: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  attachments: MessageAttachment[];
};

export type AdminMessage = {
  id: string;
  paymentId: string;
  projectCode: string;
  planName: string;
  clientName: string;
  clientEmail: string;
  message: string;
  senderType: "client" | "admin";
  senderName: string;
  senderEmail: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  attachments: MessageAttachment[];
  unreadCount: number;
};

export type MessageAttachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
};

export type CreateMessageData = {
  paymentId: string;
  message: string;
  senderType: "client" | "admin";
  attachments?: {
    fileName: string;
    fileUrl: string;
    blobKey?: string;
    fileSize: number;
    mimeType: string;
  }[];
};
