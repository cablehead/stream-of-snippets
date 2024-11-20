import { Component, For } from "solid-js";

import { CASStore } from "../store/cas";
import Card from "../Card";

const Home: Component<{ index: () => any[], CAS: CASStore }> = (props) => {
  return (
    <For each={props.index()}>
      {(frames) => <Card frames={frames} CAS={props.CAS} />}
    </For>
  );
};

export default Home;
