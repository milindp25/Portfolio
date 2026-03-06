"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatToggle } from "./ChatToggle";
import { ChatWindow } from "./ChatWindow";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <ChatToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="dialog"
            aria-label="Chat with Milind's AI assistant"
            className="fixed bottom-20 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl max-sm:inset-x-3 max-sm:bottom-20 max-sm:h-[70vh] max-sm:w-auto"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="font-mono text-xs font-medium text-foreground">
                milind.chat
              </span>
              <span className="font-mono text-[10px] text-tertiary">
                — ask me anything
              </span>
            </div>

            {/* Chat content */}
            <ChatWindow />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
