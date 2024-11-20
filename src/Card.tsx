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
  overflow-wrap: break-word;
`;

const Meta = styled("div")`
  font-size: 0.90em;
  padding: 0.5em 1em;
  display: flex;
  flex-direction: column;
`;

const MetaRow = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyButton = styled("div")`
  cursor: pointer;
  padding: 0.25em;
  border-radius: 0.25em;
  transition: background-color 0.3s;
  line-height: 0;
  &:hover {
    background-color: var(--color-pill);
  box-shadow: 0 0 0.25em var(--color-shadow);
  }
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
      setTimeout(() => setCopied(false), 1000);
    });
  };
  return (
    <CopyButton onClick={handleCopyClick}>
      {copied() ? <CopyCheck size={18} /> : <Copy size={18} />}
    </CopyButton>
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
      <Meta class="panel">
        <MetaRow>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(baseId());
            }}
          >
            {baseId()}
          </a>
          <Show when={contentSignal()()} keyed>
            {(content) => <CopyIcon content={content} />}
          </Show>
        </MetaRow>
        <MetaRow>
          {formatRelative(stamp, new Date())}
        </MetaRow>
      </Meta>
      <Content>
        <Show when={renderContent()} keyed>
          {(content) => <div class="markdown" innerHTML={content as string} />}
        </Show>
      </Content>
    </CardWrapper>
  );
};

export default Card;
