import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { styled } from "solid-styled-components";

import { Scru128Id } from "scru128";
import { formatRelative } from "date-fns";

import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

import hljs from "highlight.js";

import { Frame } from "./store/stream";
import { CASStore } from "./store/cas";

// Set up `marked` with `marked-highlight`
const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

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
