import { createEffect, createSignal } from "solid-js";

import githubTheme from "highlight.js/styles/github.css?raw";
import nordTheme from "highlight.js/styles/nord.css?raw";

const [prefersDark, setPrefersDark] = createSignal(false);
const toggleTheme = () => setPrefersDark(!prefersDark());

const applyTheme = (css: string) => {
  let styleTag = document.getElementById("dynamic-theme-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "dynamic-theme-style";
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = css;
};

createEffect(() => {
  document.body.dataset.theme = prefersDark() ? "dark" : "light";
  applyTheme(prefersDark() ? nordTheme : githubTheme);
});

export { prefersDark, toggleTheme };
