import { createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Frame } from "./stream";

export type StreamStore = { [key: string]: Frame[] };

type StreamProps = {
  dataSignal: () => Frame | null;
};

export function useStore({ dataSignal }: StreamProps) {
  const [frames, setFrames] = createStore<StreamStore>({});
  const [title, setTitle] = createSignal<Frame | null>(null);

  const [thresholdReached, setThresholdReached] = createSignal(false);

  createEffect(() => {
    const frame = dataSignal();
    if (!frame) return;

    if (frame.topic === "title") {
      setTitle(frame);
      return;
    }

    if (frame.topic === "snippet") {
      const frameId = frame.meta?.updates ?? frame.id;
      setFrames(frameId, (existingFrames = []) => [frame, ...existingFrames]);
    }

    if (frame.topic === "xs.threshold") {
      setThresholdReached(true);
    }
  });

  const index = createMemo(() => {
    if (!thresholdReached()) return undefined;
    return Object.keys(frames)
      .sort((a, b) => b.localeCompare(a))
      .map((id) => frames[id]);
  });

  return {
    index,
    title,
  };
}
