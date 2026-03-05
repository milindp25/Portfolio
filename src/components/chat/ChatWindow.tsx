"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const SUGGESTED_QUESTIONS = [
  "What does Milind do?",
  "What's his tech stack?",
  "Tell me about his projects",
];

const RATE_LIMIT_MESSAGES = [
  "Whoa there, speed racer! 🏎️ You're asking questions faster than Milind writes code. Give me a sec to catch my breath!",
  "Easy tiger! 🐯 I love the enthusiasm, but I need a quick breather. Try again in a minute!",
  "Chill out on the questions! 🧊 I'm flattered by the attention, but even AI assistants need a coffee break. Back in a min!",
  "Hold up! ✋ You're hitting me with questions like it's a speed round. Let's slow it down — try again in a moment!",
  "Rate limit hit! 🚦 Looks like you're really into Milind's background (who wouldn't be?). Give me ~60 seconds to recharge!",
  "Okay okay, I get it — Milind is fascinating! 😄 But I need a quick timeout. Ping me again in a minute!",
];

/** Map assistant message IDs to the user question that triggered them. */
type QuestionMap = Record<string, string>;

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [questionMap, setQuestionMap] = useState<QuestionMap>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (question: string) => {
      if (isLoading) return;

      // Add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: question,
      };

      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      // Track which question triggered this assistant response
      setQuestionMap((prev) => ({ ...prev, [assistantId]: question }));
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            const quip =
              RATE_LIMIT_MESSAGES[
                Math.floor(Math.random() * RATE_LIMIT_MESSAGES.length)
              ];
            throw new Error(quip);
          }
          throw new Error("Sorry, something went wrong. Please try again.");
        }

        // Read the streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No response body");

        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          accumulated += decoder.decode(value, { stream: true });

          // Update assistant message with streamed content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: accumulated }
                : msg,
            ),
          );
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Sorry, something went wrong. Please try again.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: errorMsg }
              : msg,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Messages area */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="font-mono text-xs text-tertiary">
                Ask me anything about
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Milind&apos;s Background
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-left font-mono text-xs text-secondary transition-colors hover:border-border-emphasis hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              questionText={
                msg.role === "assistant"
                  ? questionMap[msg.id]
                  : undefined
              }
              isStreaming={
                isLoading &&
                msg.role === "assistant" &&
                msg.id === messages[messages.length - 1]?.id
              }
            />
          ))
        )}

        {/* Streaming indicator */}
        {isLoading &&
          messages[messages.length - 1]?.content === "" && (
            <div className="flex justify-start">
              <div className="flex gap-1 rounded-lg border border-border bg-surface px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary [animation-delay:300ms]" />
              </div>
            </div>
          )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
