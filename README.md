A personal microblog that allows you to share a 'stream of snippets'—fragments of Markdown that you can append from the command line.

## a stream of snippets

![a women projecting a "stream of snippets", notes she's curated, kung fu cartoon styled, seemingly to save the world](https://github.com/user-attachments/assets/9f631a69-c017-4b1d-9a8f-774e059e578b)

### overview

This is a lightweight, static [SolidJS](https://www.solidjs.com) app that tails an [`xs`](https://github.com/cablehead/xs) event stream. It publishes frames with the topic 'snippet' and displays them as Markdown fragments.

<img width="954" alt="image" src="https://github.com/user-attachments/assets/963b3fac-2eb3-411f-a88f-87635958bf5b">

<pre>
http://your-stream-of-snippets...
┌───────────────────────────────────────────────────┐
│   # proxy api requests to xs                      │
│   # /api/*  ◀─────────────────────────────────────┼────────┐
│                                                   │        │
│   # otherwise serve the static SolidJS built dist │        │
│   # /* -> ./dist/*                                │        │
└───────────────────────────────────────────────────┘        │
                               ┌─────────────────────────────┴─────┐
                               │ `xs serve ./store --expose :3021` │
                               └──────────────────────────────▲────┘
 ┌────────────────────────────────────────────────┐           │
 │ to publish:                                    │           │
 │                                                │           │
 │ $ $env.XS_PWD = ":3021"                        │           │
 │                                                │           │
 │ $ bp | .append snippet   ──────────────────────┼───────────┘
 └────────────────────────────────────────────────┘
</pre>

```
$ bp | bat -l md
───────┬────────────────────────────────────────────────────────────────────────
       │ STDIN
───────┼────────────────────────────────────────────────────────────────────────
   1   │ Posting here looks like this:
   2   │
   3   │ ```bash
   4   │ bp | .append snippet
   5   │ ```
   6   │
   7   │ Where `bp` is the current contents of my clipboard.
───────┴────────────────────────────────────────────────────────────────────────
```

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

### screencasts and screenshots


https://github.com/user-attachments/assets/fba60beb-c5ae-42ba-97b4-e9564a74b722

<img width="1024" alt="image" src="https://github.com/user-attachments/assets/d20189c4-3f13-4595-b0b5-b5fdc11cf518">

