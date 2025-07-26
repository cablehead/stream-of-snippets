import { createSignal, onCleanup, onMount } from "solid-js";

export type Frame = {
  id: string;
  topic: string;
  hash: string;
  meta?: {
    role?: "user" | "assistant" | "system";
    continues?: string | string[];
    head?: string; // bookmark
    cache?: boolean;
    content_type?: string;
    type?: "document";
    options?: Record<string, any>; // delta
    document_name?: string;
    file_size?: number;
    original_path?: string;
    [key: string]: any;
  };
};

export type ContentBlock = 
  | { type: "text"; text: string; cache_control?: {type: "ephemeral"} }
  | { type: "tool_use"; name: string; input: any; id?: string }
  | { type: "tool_result"; content: any; name?: string; tool_use_id?: string }
  | { type: "document"; source: {type: "base64", media_type: string, data: string}, cache_control?: {type: "ephemeral"} };

export type Turn = {
  id: string;
  role: "user" | "assistant" | "system";
  hash: string; // For lazy content loading
  meta: Record<string, any>; // For content parsing
  timestamp: Date;
  options: Record<string, any>; // inherited
  cache: boolean;
};

export type Thread = {
  turns: Turn[];
  head_id: string;
  options: Record<string, any>; // merged
};

export function useFrameStream() {
  const [frame, setFrame] = createSignal<Frame | null>(null);

  onMount(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      const response = await fetch("/api?follow", { signal });
      const textStream = response.body!
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(splitStream("\n"));

      const reader = textStream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value.trim()) {
          const json = JSON.parse(value);
          setFrame(json); // Update the signal with each new frame
        }
      }

      reader.releaseLock();
    };

    fetchData();

    onCleanup(() => {
      controller.abort();
    });
  });

  return frame;
}

// Utility function to split a stream by a delimiter
function splitStream(delimiter: string) {
  let buffer = "";
  return new TransformStream<string, string>({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(delimiter);
      buffer = parts.pop()!;
      parts.forEach((part) => controller.enqueue(part));
    },
    flush(controller) {
      if (buffer) {
        controller.enqueue(buffer);
      }
    },
  });
}
