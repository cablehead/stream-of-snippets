import { Component, createResource, For } from "solid-js";

import { useFrameStream } from "./store/stream";
import { useStore } from "./store";
import { createCAS } from "./store/cas";
import Card from "./Card";
import { marked } from "./marked";
import { prefersDark, toggleTheme } from "./theme";

import ThemeTrigger from "./components/ThemeTrigger";

const App: Component = () => {
  const frameSignal = useFrameStream();

  const fetchContent = async (hash: string) => {
    const response = await fetch(`/api/cas/${hash}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content for hash ${hash}`);
    }
    return await response.text();
  };

  const { index, title } = useStore({ dataSignal: frameSignal });
  const CAS = createCAS(fetchContent);

  const [titleContent] = createResource(
    () => {
      const frame = title();
      if (!frame) return "a stream of snippets";
      return CAS.get(frame.hash)() || "a stream of snippets";
    },
    async (content) => {
      return await marked.parse(content);
    },
  );

  return (
    <div>
      <header style="
                       display: flex;
                       justify-content: space-between;
                       align-items: center;
                       padding: 1em 0 2em;
                       ">
        <span
          style="font-size: 2em; font-weight: 500;"
          innerHTML={titleContent()}
        />

        <ThemeTrigger prefersDark={prefersDark} toggleTheme={toggleTheme} />
      </header>

      <For each={index()}>
        {(frames) => <Card frames={frames} CAS={CAS} />}
      </For>
    </div>
  );
};

export default App;
