import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { styled } from "solid-styled-components";

import { Scru128Id } from "scru128";
import { formatRelative } from "date-fns";

import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Choose a theme (e.g., github.css, dark.css, etc.)

marked.setOptions({
  highlight: (code, lang) => {
		console.log("HERE", code, lang);
    // If a language is specified, use it; otherwise, use automatic language detection
    return lang ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value;
  }
});

import { Frame } from "./store/stream";
import { CASStore } from "./store/cas";

const CardWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  overflow: hidden;
  border-radius: 0.25em;
`;

const Content = styled("div")`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.25em 0.5em;
`;

const Meta = styled("div")`
  font-size: 0.80em;
  color: var(--color-sub-fg);
  background-color: var(--color-sub-bg);
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

  const renderContent = () => {
    const content = contentSignal()();
    if (!content) return null;
    const htmlContent = marked(content);
    return <div innerHTML={htmlContent} />;
  };

  const id = Scru128Id.fromString(frame().id);
  const stamp = new Date(id.timestamp);

  return (
    <CardWrapper>
      <Content>{renderContent()}</Content>
      <Meta>
        <span>
          {formatRelative(stamp, new Date())}
        </span>
      </Meta>
    </CardWrapper>
  );
};

export default Card;
