import { Component, Show } from "solid-js";
import { styled } from "solid-styled-components";

import { Scru128Id } from "scru128";
import { formatRelative } from "date-fns";

import { Frame } from "./store/stream";
import { CASStore } from "./store/cas";

import { marked } from "./marked";

const CardWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  border-radius: 0.25em;
	box-shadow: 0 0 0.25em var(--color-shadow);
	border-left: none;
	border-right: none;

  margin-bottom: 1em;
`;

const Content = styled("div")`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25em 0.5em;
`;

const Meta = styled("div")`
  font-size: 0.90em;
  color: var(--color-sub-fg);
  background-color: var(--color-accent);
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  justify-content: end;
`;

type CardProps = {
  frames: Frame[];
  CAS: CASStore;
};

const Card: Component<CardProps> = (props) => {
  const { frames, CAS } = props;
  const frame = () => frames[0];

  const contentSignal = () => CAS.get(frame().hash);

  const renderContent = () => marked.parse(contentSignal()() || "");

  const id = Scru128Id.fromString(frame().id);
  const stamp = new Date(id.timestamp);

  return (
    <CardWrapper>
      <Content>
        <Show when={renderContent()} keyed>
          {(content) => <div class="markdown" innerHTML={content as string} />}
        </Show>
      </Content>
      <Meta>
        <span>{formatRelative(stamp, new Date())}</span>
      </Meta>
    </CardWrapper>
  );
};

export default Card;
