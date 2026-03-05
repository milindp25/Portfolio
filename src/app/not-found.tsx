"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const QUIRKY_GIFS = [
  {
    url: "https://media3.giphy.com/media/NTur7XlVDUdqM/giphy.gif",
    caption: "This is fine... everything is fine.",
    alt: "Dog sitting in a room on fire saying this is fine",
  },
  {
    url: "https://media0.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif",
    caption: "Looking for this page like...",
    alt: "John Travolta looking around confused",
  },
  {
    url: "https://media2.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif",
    caption: "Wait... where did the page go?",
    alt: "Confused Travolta from Pulp Fiction",
  },
  {
    url: "https://media1.giphy.com/media/9M5jK4GXmD5o1irGrF/giphy.gif",
    caption: "The server right now:",
    alt: "This is fine meme with fire",
  },
  {
    url: "https://media4.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif",
    caption: "Searching for this page...",
    alt: "Cartoon character searching around confused",
  },
  {
    url: "https://media4.giphy.com/media/ji6zzUZwNIuLS/giphy.gif",
    caption: "Me trying to find this URL:",
    alt: "Confused person looking around",
  },
];

const QUIRKY_MESSAGES = [
  "Looks like this page took a vacation and forgot to tell anyone.",
  "Houston, we have a 404 situation.",
  "This page has gone to live on a farm upstate.",
  "You've reached the edge of the internet. Turn back.",
  "The page you want is in another castle.",
  "Congratulations! You found the void.",
];

export default function NotFound() {
  const [gifIndex, setGifIndex] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGifIndex(Math.floor(Math.random() * QUIRKY_GIFS.length));
    setMsgIndex(Math.floor(Math.random() * QUIRKY_MESSAGES.length));
    setLoaded(true);
  }, []);

  const gif = QUIRKY_GIFS[gifIndex];
  const message = QUIRKY_MESSAGES[msgIndex];

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      {/* Glitchy 404 heading */}
      <div className="relative mb-6">
        <p className="font-mono text-7xl font-bold text-accent sm:text-8xl">
          4
          <span className="relative inline-block animate-pulse">
            0
            <span className="absolute inset-0 animate-ping text-accent/30">
              0
            </span>
          </span>
          4
        </p>
      </div>

      {/* GIF container */}
      <div
        className={`mb-6 overflow-hidden rounded-xl border border-border bg-surface transition-all duration-500 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gif.url}
            alt={gif.alt}
            className="h-auto w-full max-w-[320px] sm:max-w-[380px]"
            loading="eager"
          />
        </div>
        <div className="border-t border-border bg-surface/80 px-4 py-2.5">
          <p className="text-center font-mono text-xs text-secondary italic">
            {gif.caption}
          </p>
        </div>
      </div>

      {/* Message */}
      <h1 className="mb-2 text-center text-lg font-medium text-foreground sm:text-xl">
        Page not found
      </h1>
      <p
        className={`max-w-md text-center text-sm text-tertiary transition-all duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {message}
      </p>

      {/* Action buttons */}
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="rounded-lg bg-accent px-5 py-2.5 font-mono text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Take me home
        </Link>
        <button
          onClick={() => {
            setGifIndex(
              (prev) => (prev + 1) % QUIRKY_GIFS.length
            );
            setMsgIndex(
              (prev) => (prev + 1) % QUIRKY_MESSAGES.length
            );
          }}
          className="rounded-lg border border-border px-5 py-2.5 font-mono text-sm text-secondary transition-colors hover:border-accent hover:text-accent"
        >
          Show me another GIF
        </button>
      </div>

      {/* Powered by GIPHY attribution */}
      <p className="mt-8 font-mono text-[10px] text-tertiary/50">
        GIFs powered by GIPHY
      </p>
    </div>
  );
}
