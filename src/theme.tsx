import { createEffect, createSignal, JSX } from "solid-js";

const [prefersDark, setPrefersDark] = createSignal(false);
const toggleTheme = () => setPrefersDark(!prefersDark());

import githubTheme from "highlight.js/styles/github.css?raw";
import nordTheme from "highlight.js/styles/nord.css?raw";

import { createGlobalStyles } from "solid-styled-components";

const LightGlobalStyles = () => {
  const Styles = createGlobalStyles(githubTheme);
  return <Styles />;
};

const DarkGlobalStyles = () => {
  const Styles = createGlobalStyles`
    html,
    body {
      background-color: blue;
    }
  `;
  return <Styles />;
};

const [GlobalStyles, setGlobalStyles] = createSignal<JSX.Element>(
  LightGlobalStyles(),
);

createEffect(() => {
  document.body.dataset.theme = prefersDark() ? "dark" : "light";
  setGlobalStyles(
    () => (prefersDark() ? DarkGlobalStyles() : LightGlobalStyles()),
  );
});

export { GlobalStyles, prefersDark, toggleTheme };
