import { createEffect, createSignal } from "solid-js";
import { Frame } from "./stream";
import { useGPTStore } from "./gpt";
import { CASStore } from "./cas";

type StreamProps = {
  dataSignal: () => Frame | null;
  CAS: CASStore;
};

export function useStore({ dataSignal, CAS }: StreamProps) {
  const [title, setTitle] = createSignal<Frame | null>(null);

  createEffect(() => {
    const frame = dataSignal();
    if (!frame) return;

    if (frame.topic === "title") {
      setTitle(frame);
      return;
    }
  });

  const gptStore = useGPTStore({ dataSignal, CAS });

  return {
    currentThread: gptStore.currentThread,
    title,
    loadingState: gptStore.loadingState,
    parseContent: gptStore.parseContent,
  };
}
