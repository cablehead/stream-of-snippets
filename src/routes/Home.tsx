import { Component, For } from "solid-js";
import { A } from "@solidjs/router";

import { CASStore } from "../store/cas";
import Card from "../Card";

const Home: Component<{ index: () => any[]; CAS: CASStore }> = (props) => {
  return (
    <>
      <p>
        <A href="/">home</A>
      </p>
      <For each={props.index()}>
        {(frames) => <Card frames={frames} CAS={props.CAS} />}
      </For>
    </>
  );
};

export default Home;
