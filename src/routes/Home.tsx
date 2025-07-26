import { Component, For } from "solid-js";
import { A } from "@solidjs/router";

import { CASStore } from "../store/cas";
import { Thread } from "../store/stream";
import TurnCard from "../TurnCard";

const Home: Component<{ thread: Thread; CAS: CASStore }> = (props) => {
  return (
    <>
      <p>
        <A href="/">home</A> - Thread: {props.thread.head_id}
      </p>
      <div style="margin-bottom: 1em; padding: 0.5em; background: var(--color-bg-alt); border-radius: 0.25em;">
        <strong>Options:</strong> {JSON.stringify(props.thread.options)}
      </div>
      <For each={props.thread.turns}>
        {(turn) => <TurnCard turn={turn} CAS={props.CAS} />}
      </For>
    </>
  );
};

export default Home;
