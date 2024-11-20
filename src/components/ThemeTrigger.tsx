import { Component, Show } from "solid-js";
import { MoonStar, Sun } from "lucide-solid";

const ThemeTrigger: Component<
  { prefersDark: () => boolean; toggleTheme: () => void }
> = (props) => {
  return (
    <div class="icon-button" onclick={props.toggleTheme}>
      <Show
        when={props.prefersDark()}
        fallback={<MoonStar />}
      >
        <Sun />
      </Show>
    </div>
  );
};

export default ThemeTrigger;
