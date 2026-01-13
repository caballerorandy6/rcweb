"use client";

import { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { getAdminMessagesAction } from "@/actions/messages/getAdminMessagesAction";
import { sendAdminMessageAction } from "@/actions/messages/sendAdminMessageAction";
import { formatDate } from "@/lib/utils";
import type { AdminMessage } from "@/types/message";

interface AdminMessagesProps {
  paymentId: string;
  projectCode: string;
  planName: string;
  clientName: string;
  clientEmail: string;
  onClose: () => void;
}

export default function AdminMessages({
  paymentId,
  projectCode,
  planName,
  clientName,
  clientEmail,
  onClose,
}: AdminMessagesProps) {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [paymentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const result = await getAdminMessagesAction(paymentId);
    if (result.success) {
      setMessages(result.data.messages);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error("Message is required");
      return;
    }
    setIsSending(true);
    const result = await sendAdminMessageAction({
      paymentId,
      message: messageText.trim(),
      senderType: "admin",
    });
    if (result.success) {
      setMessageText("");
      loadMessages();
      toast.success("Message sent");
    } else {
      toast.error(result.error);
    }
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter">
              Messages - {projectCode}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-gray-400">
            <span>{clientName}</span>
            <span>-</span>
            <span>{clientEmail}</span>
            <span>-</span>
            <span>{planName}</span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {isLoading ? (
            <p className="text-gray-400 text-sm text-center">
              Loading messages...
            </p>
          ) : messages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderType === "admin" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.senderType === "admin"
                      ? "bg-gold/20 border border-gold/30"
                      : "bg-blue-500/20 border border-blue-500/30"
                  }`}
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {msg.senderName} - {formatDate(msg.createdAt)}
                  </p>
                  <p className="text-sm text-white whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  {msg.attachments.length > 0 && (
                    <div className="mt-2">
                      {msg.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-500"
                        >
                          {att.fileName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50">
          <div className="flex gap-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={2}
              className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isSending}
              className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 border border-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
