import { Component, createResource, For } from "solid-js";

import { useFrameStream } from "./store/stream";
import { useStore } from "./store";
import { createCAS } from "./store/cas";
import Card from "./Card";
import { marked } from "./marked";
import { prefersDark, toggleTheme } from "./theme";

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
        />;

        <div style="cursor: pointer;" onclick={toggleTheme}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler
			icons-tabler-outline icon-tabler-sun"
            style={!prefersDark() ? "display: none;" : ""}
          >
            <path
              stroke="none"
              d="M0
			0h24v24H0z"
              fill="none"
            />
            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8
			0" />
            <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7
			.7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-moon-stars"
            style={prefersDark() ? "display: none;" : ""}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
            <path d="M19 11h2m-1 -1v2" />
          </svg>
        </div>
      </header>

      <For each={index()}>
        {(frames) => <Card frames={frames} CAS={CAS} />}
      </For>
    </div>
  );
};

export default App;
