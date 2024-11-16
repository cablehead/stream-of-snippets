import { Component, createSignal, Show } from "solid-js";
import { styled } from "solid-styled-components";

import { Copy, CopyCheck } from "lucide-solid";

import { Scru128Id } from "scru128";
import { formatRelative } from "date-fns";

import { Frame } from "./store/stream";
import { CASStore } from "./store/cas";

import { marked } from "./marked";

const CardWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

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
  justify-content: space-between;
`;

type CardProps = {
  frames: Frame[];
  CAS: CASStore;
};

const CopyIcon: Component<{ content: string }> = (props) => {
  const [copied, setCopied] = createSignal(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(props.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    });
  };

  return (
    <div
      style="
        position: absolute;
        right: 1em;
        top: 1em;
        cursor: pointer;
        padding: 0.25em;
        border-radius: 0.25em;
        transition: background-color 0.1s;
        line-height: 0;
    "
      onClick={handleCopyClick}
      onMouseOver={(
        e,
      ) => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
      onMouseOut={(
        e,
      ) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {copied() ? <CopyCheck /> : <Copy />}
    </div>
  );
};

const Card: Component<CardProps> = (props) => {
  const { frames, CAS } = props;

  const frame = () => frames[0];
  const baseFrame = () => frames[frames.length - 1];
  const baseId = () => baseFrame().id;

  const contentSignal = () => CAS.get(frame().hash);

  const renderContent = () => marked.parse(contentSignal()() || "");

  const stamp = new Date(Scru128Id.fromString(baseId()).timestamp);

  return (
    <CardWrapper>
      <Show when={contentSignal()()} keyed>
        {(content) => <CopyIcon content={content} />}
      </Show>
      <Content>
        <Show when={renderContent()} keyed>
          {(content) => <div class="markdown" innerHTML={content as string} />}
        </Show>
      </Content>
      <Meta>
        <span style="color: var(--color-bg);">
          {formatRelative(stamp, new Date())}
        </span>
        <span>
          <a
            style="color: var(--color-bg"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(baseId());
            }}
          >
            {baseId().slice(0, 3) + "..." + baseId().slice(-4)}
          </a>
        </span>
      </Meta>
    </CardWrapper>
  );
};

export default Card;
