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

export default function ClientMessages({
  projectCode,
  paymentId,
}: ClientMessagesProps) {
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [projectCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const result = await getProjectMessagesAction(projectCode);
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

    const result = await sendClientMessageAction({
      paymentId,
      message: messageText.trim(),
      senderType: "client",
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
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl text-gold font-semibold font-inter mb-4">
        Project Messages
      </h3>
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 sm:p-6">
        {/* Messages Container */}
        <div className="h-80 overflow-y-auto mb-4 space-y-3">
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
                className={`flex ${msg.senderType === "client" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.senderType === "client"
                      ? "bg-gold/20 border border-gold/30"
                      : "bg-gray-700/50 border border-gray-600/30"
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
  );
}
