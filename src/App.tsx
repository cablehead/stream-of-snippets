import { Component, createEffect, createResource, Show } from "solid-js";

import { A, Route, Router, useParams } from "@solidjs/router";

import { useFrameStream } from "./store/stream";
import { useStore } from "./store";
import { createCAS } from "./store/cas";
import { marked } from "./marked";
import { prefersDark, toggleTheme } from "./theme";

import ThemeTrigger from "./components/ThemeTrigger";

import Card from "./Card";
import NotFound from "./routes/NotFound";
import Home from "./routes/Home";

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

      <Show when={index() !== undefined} fallback={<p>Loading...</p>}>
        <Router>
          <Route
            path="/"
            component={() => <Home index={index()!} CAS={CAS} />}
          />
          <Route
            path="/:id"
            component={() => {
              const params = useParams();
              const frameId = params.id;

              const foundSnippet = index()!.find((frames) => {
                return frames[frames.length - 1].id === frameId;
              });

              return (
                <Show when={foundSnippet} fallback={<NotFound />}>
                  <p>
                    <A href="/">home</A> / <A href={`/${frameId}`}>{frameId}</A>
                  </p>
                  <Card frames={foundSnippet!} CAS={CAS} />
                </Show>
              );
            }}
          />
          <Route path="*paramName" component={NotFound} />
        </Router>
      </Show>
    </div>
  );
};

export default App;
