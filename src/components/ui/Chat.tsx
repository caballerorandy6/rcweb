"use client";

import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { event as trackEvent } from "@/lib/analytics";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm Maria, your virtual assistant for RC Web Solutions. I'm here to help you with information about our services, pricing, projects, and answer any questions you might have. How can I assist you today?",
};

interface ChatProps {
  onClose: () => void;
}

export default function Chat({ onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasTrackedEngagement, setHasTrackedEngagement] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Track first user engagement with AI Chat
    if (!hasTrackedEngagement) {
      trackEvent({
        action: "ai_chat_engagement",
        category: "engagement",
        label: "first_message",
      });
      setHasTrackedEngagement(true);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: assistantMessage }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or contact support.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl border border-gold/20 rounded-2xl shadow-2xl flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/30">
            <Image
              src="/maria.avif"
              alt="Maria - AI Assistant"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-gold font-iceland text-2xl">Maria</h3>
            <p className="text-xs text-white/50 font-inter">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-gold transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 animate-enter ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Avatar para mensajes del asistente */}
            {message.role === "assistant" && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold/20 shrink-0">
                <Image
                  src="/maria.avif"
                  alt="Maria"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            )}

            <div
              className={`max-w-[75%] p-3 rounded-lg font-inter text-sm ${
                message.role === "user"
                  ? "bg-gold text-gray-900 rounded-br-none"
                  : "bg-gray-800 text-white rounded-bl-none border border-gold/10"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start animate-enter">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold/20 shrink-0">
              <Image
                src="/maria.avif"
                alt="Maria"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gold/10">
              {/* Typing indicator */}
              <div className="flex space-x-2" aria-label="Maria is typing">
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gold/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gold/20 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/20 font-inter text-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="bg-gold text-gray-900 p-2 rounded-lg hover:bg-gold/90 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-white/30 font-inter mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
}
