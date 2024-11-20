import { Component } from "solid-js";
import { Sun, MoonStar } from "lucide-solid";

const ThemeTrigger: Component<{ prefersDark: () => boolean; toggleTheme: () => void }> = (props) => {
  return (
    <div class="icon-button" onclick={props.toggleTheme}>
      <Show when={props.prefersDark()} fallback={<MoonStar width={24} height={24} />}>
        <Sun width={24} height={24} />
      </Show>
    </div>
  );
};

export default ThemeTrigger;
