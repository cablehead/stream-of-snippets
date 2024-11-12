A personal microblog that allows you to share a 'stream of snippets'—fragments of Markdown that you can append from the command line.

## a stream of snippets

<img width="1024" alt="a women projecting a 'stream of snippets', notes she's curated, kung fu cartoon styled, seemingly to save the world" src="https://github.com/user-attachments/assets/4369df4a-ddae-437c-ba3d-aef007c3fd44">

### overview

This is a lightweight, static [SolidJS](https://www.solidjs.com) app that tails an [`xs`](https://github.com/cablehead/xs) event stream. It publishes frames with the topic 'snippet' and displays them as Markdown fragments.

### dev

```bash
$ git clone https://github.com/cablehead/stream-of-snippets.git
$ cd stream-of-snippets

# run the event stream in one window
$ xs serve ./store —expose :3021

# run vite in another window
$ deno task dev

# append a snippet in a 3rd window
$ echo "my first post" | xs append ./store snippet
```

![image](https://github.com/user-attachments/assets/ffcb4947-209f-407a-81b7-653d24d01eff)

[vite.config.ts](https://github.com/cablehead/stream-of-snippets/blob/main/vite.config.ts#L9-L14) is configured to proxy `/api/*` to localhost:3021, to expose the event stream

<pre>
http://your-stream-of-snippets...
┌───────────────────────────────────────────────────┐
│   # proxy /api to xs                              │
│   # /api/*  ◀─────────────────────────────────────┼────────┐
│                                                   │        │
│   # otherwise serve the static SolidJS built dist │        │
│   # /* -> ./dist/*                                │        │
└───────────────────────────────────────────────────┘        │
                               ┌─────────────────────────────┴─────┐
                               │ `xs serve ./store --expose :3021` │
                               └────────────────────────────▲──────┘
  to publish:                                               │
      $ bp | xs append ./store snippet  ]───────────────────┘
</pre>

### screencasts and screenshots


https://github.com/user-attachments/assets/fba60beb-c5ae-42ba-97b4-e9564a74b722

<img width="1024" alt="image" src="https://github.com/user-attachments/assets/d20189c4-3f13-4595-b0b5-b5fdc11cf518">

