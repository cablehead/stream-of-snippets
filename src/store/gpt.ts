import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Scru128Id } from "scru128";
import { Frame, Turn, Thread, ContentBlock } from "./stream";
import { CASStore } from "./cas";

// Deep merge where source overwrites target (replicates Nu's merge deep)
function mergeDeep(target: any, source: any): any {
  if (typeof source !== 'object' || source === null) return source;
  if (typeof target !== 'object' || target === null) return source;
  
  const result = { ...target };
  for (const key in source) {
    if (Array.isArray(source[key])) {
      result[key] = [...source[key]]; // Replace arrays entirely
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      result[key] = mergeDeep(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

type GPTStore = { [key: string]: Frame };

type GPTStoreProps = {
  dataSignal: () => Frame | null;
  CAS: CASStore;
};

export function useGPTStore({ dataSignal, CAS }: GPTStoreProps) {
  const [frames, setFrames] = createStore<GPTStore>({});
  const [currentHeadId, setCurrentHeadId] = createSignal<string | null>(null);
  const [thresholdReached, setThresholdReached] = createSignal(false);
  
  const loadingState = () => {
    if (!thresholdReached()) return "Waiting for initial data...";
    if (!currentHeadId()) return "No GPT turns found yet...";
    return "Building thread...";
  };

  createEffect(() => {
    const frame = dataSignal();
    if (!frame) return;

    // Handle threshold signal
    if (frame.topic === "xs.threshold") {
      setThresholdReached(true);
      return;
    }

    if (frame.topic !== "gpt.turn") return;

    // Add frame to cache
    setFrames(frame.id, frame);
    
    // Always update to most recent frame - we'll find the real head later
    setCurrentHeadId(frame.id);
  });

  // Convert a frame to a turn (replicates frame-to-turn from ctx.nu)
  // Returns a turn with a hash reference - content will be resolved lazily
  const frameToTurn = (frame: Frame): Turn => {
    const meta = frame.meta || {};
    const role = meta.role || "user";
    const cache = meta.cache || false;
    const options_delta = meta.options || {};

    return {
      id: frame.id,
      role: role as "user" | "assistant" | "system",
      hash: frame.hash, // Store hash for lazy content loading
      meta: meta, // Store meta for content parsing
      timestamp: new Date(Scru128Id.fromString(frame.id).timestamp),
      options: options_delta,
      cache
    };
  };

  // Find the actual thread head that contains the given frame ID
  const findThreadHead = (frameId: string): string => {
    const allFrames = Object.values(frames);
    
    // Find all frames that continue from our frameId (directly or indirectly)
    const findContinuations = (id: string): string[] => {
      const continuations: string[] = [];
      for (const frame of allFrames) {
        const continues = frame.meta?.continues;
        if (continues) {
          const continuesFrom = Array.isArray(continues) ? continues : [continues];
          if (continuesFrom.includes(id)) {
            continuations.push(frame.id);
            // Recursively find what continues from this frame
            continuations.push(...findContinuations(frame.id));
          }
        }
      }
      return continuations;
    };
    
    const continuations = findContinuations(frameId);
    
    // If nothing continues from our frame (directly or indirectly), it's the head
    if (continuations.length === 0) {
      return frameId;
    }
    
    // Otherwise, find the most recent continuation
    const sorted = continuations.sort((a, b) => b.localeCompare(a));
    return sorted[0];
  };

  // Follow continues chain to build chronological turn list
  const idToTurns = (headId: string): Turn[] => {
    const turns: Turn[] = [];
    const stack = [headId];

    while (stack.length > 0) {
      const currentId = stack.shift()!;
      const frame = frames[currentId];
      
      if (!frame) continue;

      const turn = frameToTurn(frame);
      turns.unshift(turn); // Prepend for chronological order (always add, even with placeholder)

      // Add continues to stack
      const continues = frame.meta?.continues;
      if (continues) {
        if (typeof continues === 'string') {
          stack.push(continues);
        } else if (Array.isArray(continues)) {
          stack.push(...continues);
        }
      }
    }

    return turns;
  };

  // Resolve full thread context (replicates ctx resolve)
  const [resolveThread, setResolveThread] = createSignal<Thread | null>(null);
  
  createEffect(() => {
    const mostRecentId = currentHeadId();
    const threshold = thresholdReached();
    
    // Don't resolve thread until threshold is reached and we have a frame
    if (!mostRecentId || !threshold) {
      setResolveThread(null);
      return;
    }

    // Find the actual thread head that contains our most recent frame
    const realHeadId = findThreadHead(mostRecentId);
    
    const turns = idToTurns(realHeadId);
    
    // Merge options across all turns in chronological order
    const mergedOptions = turns.reduce((acc, turn) => {
      if (Object.keys(turn.options).length > 0) {
        return mergeDeep(acc, turn.options);
      }
      return acc;
    }, {});

    setResolveThread({
      turns,
      head_id: realHeadId,
      options: mergedOptions
    });
  });

  // Helper to parse content from a turn (for use in components)
  const parseContent = (turn: Turn): ContentBlock[] => {
    const content_raw = CAS.get(turn.hash)();
    const meta = turn.meta;
    const cache = turn.cache;

    if (!content_raw) {
      // Content not loaded yet - show placeholder
      return [{ type: "text", text: "Loading..." }];
    }

    if (meta.type === "document" && meta.content_type) {
      // Document type
      return [{
        type: "document",
        cache_control: cache ? { type: "ephemeral" } : undefined,
        source: {
          type: "base64",
          media_type: meta.content_type,
          data: btoa(content_raw) // Convert to base64
        }
      }];
    } else if (meta.content_type === "application/json") {
      // JSON content (structured blocks)
      try {
        return JSON.parse(content_raw);
      } catch {
        return [{ type: "text", text: content_raw }];
      }
    } else {
      // Plain text
      return [{
        type: "text",
        text: content_raw,
        cache_control: cache ? { type: "ephemeral" } : undefined
      }];
    }
  };

  return {
    currentThread: resolveThread,
    frames,
    loadingState,
    parseContent
  };
}