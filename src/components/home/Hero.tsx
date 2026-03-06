"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TerminalBlock } from "@/components/ui/TerminalBlock";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center px-6 pb-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Greeting above terminal */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-mono text-sm text-tertiary"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          Milind Prabhakar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 max-w-lg text-lg text-secondary"
        >
          Senior Software Engineer building enterprise-grade systems in
          financial services. Currently at Capital One.
        </motion.p>

        {/* Terminal — the signature element */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TerminalBlock title="~" className="mb-10">
            <div className="space-y-1">
              <p>
                <span className="text-accent">$</span>
                <span className="text-tertiary"> cat focus.txt</span>
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                className="text-secondary"
              >
                Microservices &middot; Event-driven architecture &middot;
                React &middot; Spring Boot &middot; AWS
              </motion.p>
              <div className="h-1" />
              <p>
                <span className="text-accent">$</span>
                <span className="text-tertiary"> env | grep STACK</span>
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.3 }}
                className="space-y-0.5 text-secondary"
              >
                <p>
                  <span className="text-accent">BACKEND</span>
                  =Java,Spring_Boot,Kafka
                </p>
                <p>
                  <span className="text-accent">FRONTEND</span>
                  =React,Next.js,TypeScript
                </p>
                <p>
                  <span className="text-accent">CLOUD</span>
                  =AWS,Docker,Kubernetes
                </p>
              </motion.div>
            </div>
          </TerminalBlock>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="flex gap-3"
        >
          <Link href="/projects">
            <Button variant="primary" size="lg">
              View Projects
            </Button>
          </Link>
          <Link href="/experience">
            <Button variant="outline" size="lg">
              Experience
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              // Find and click the chat toggle button
              const toggle = document.querySelector<HTMLButtonElement>(
                'button[aria-label="Open chat"]',
              );
              toggle?.click();
            }}
          >
            <MessageCircle size={16} />
            Ask AI
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
