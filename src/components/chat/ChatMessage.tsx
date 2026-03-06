"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { FeedbackButtons } from "./FeedbackButtons";
import { Copy, Check } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  /** The user question that triggered this response (for feedback). */
  questionText?: string;
  /** Whether the response is still streaming. */
  isStreaming?: boolean;
}

export function ChatMessage({
  message,
  questionText,
  isStreaming,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const showFeedback =
    !isUser && message.content.length > 0 && !isStreaming && questionText;
  const showCopy = !isUser && message.content.length > 0 && !isStreaming;

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("max-w-[85%]", !isUser && "space-y-0")}>
        <div
          className={cn(
            "relative rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-accent text-background"
              : "border border-border bg-surface text-secondary",
          )}
        >
          {isUser ? (
            message.content
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                      return (
                        <code className="block rounded bg-background px-2 py-1.5 font-mono text-xs text-accent">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="rounded bg-background px-1 py-0.5 font-mono text-xs text-accent">
                        {children}
                      </code>
                    );
                  },
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2 hover:opacity-80"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-2 list-disc pl-4 last:mb-0">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 list-decimal pl-4 last:mb-0">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-0.5">{children}</li>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {/* Actions row: feedback + copy */}
        {(showFeedback || showCopy) && (
          <div className="flex items-center gap-1">
            {showFeedback && (
              <FeedbackButtons
                question={questionText}
                answer={message.content}
              />
            )}
            {showCopy && <CopyButton text={message.content} />}
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing if clipboard API fails
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-1 rounded p-1 text-tertiary transition-colors hover:text-secondary"
      title={copied ? "Copied!" : "Copy response"}
      aria-label={copied ? "Copied to clipboard" : "Copy response"}
    >
      {copied ? (
        <Check size={12} className="text-success" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}
