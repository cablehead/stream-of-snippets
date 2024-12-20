import { Component, Show } from "solid-js";
import { styled } from "solid-styled-components";
import { A } from "@solidjs/router";

import { Scru128Id } from "scru128";
import { formatRelative } from "date-fns";
import { Fingerprint } from "lucide-solid";

import { Frame } from "./store/stream";
import { CASStore } from "./store/cas";
import { marked } from "./marked";
import CopyTrigger from "./components/CopyTrigger";

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
  background-color: var(--color-bg-alt);
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
  gap: 0.25em;
`;

type CardProps = {
  frames: Frame[];
  CAS: CASStore;
};

const Card: Component<CardProps> = (props) => {
  const { frames, CAS } = props;

  const baseFrame = frames[frames.length - 1];

  const contentSignal = () => CAS.get(frames[0].hash);
  const renderContent = () => marked.parse(contentSignal()() || "");
  const stamp = new Date(Scru128Id.fromString(baseFrame.id).timestamp);

  const recentStamp = frames.length > 1
    ? new Date(Scru128Id.fromString(frames[0].id).timestamp)
    : null;

  return (
    <CardWrapper>
      <Meta class="panel">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1em;
          ">
          <span>
            Markdown
          </span>

          <div style="display:flex; gap: 0.2em;">
            <Fingerprint
              class="icon-button"
              size={18}
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(baseFrame.id);
              }}
            />

            <Show when={contentSignal()()} keyed>
              {(content) => (
                <span>
                  <CopyTrigger content={content} />
                </span>
              )}
            </Show>
          </div>
        </div>
        <div style="
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
        ">
          {recentStamp && (
            <span>
              {formatRelative(recentStamp, new Date())}
            </span>
          )}

          <span style="margin-left: auto">
            <A href={`/${baseFrame.id}`}>
              {formatRelative(stamp, new Date())}
            </A>
          </span>
        </div>
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
