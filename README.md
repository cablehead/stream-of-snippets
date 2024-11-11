A personal microblog that allows you to share a 'stream of snippets'—fragments of Markdown that you can append from the command line.

## a stream of snippets

![a women projecting a "stream of snippets", notes she's curated, kung fu cartoon styled, seemingly to save the world](https://github.com/user-attachments/assets/9f631a69-c017-4b1d-9a8f-774e059e578b)

### overview

This is a lightweight, static SolidJS app that tails an [`xs`](https://github.com/cablehead/xs) event stream. It publishes frames with the topic 'snippet' and displays them as Markdown fragments.

<pre>
http://your-stream-of-snippets...
┌───────────────────────────────────────────────────┐
│   # proxy api requests to xs                      │
│   # /api/*  ◀─────────────────────────────────────┼────────┐
│                                                   │        │
│   # otherwise serve the static SolidJS built dist │        │
│   # /* -> ./dist/*                                │        │
└───────────────────────────────────────────────────┘        │
                                             ┌───────────────┴────────────────────────────────────┐
                                             │         `xs serve ./store --expose :3021`          │
                                             └────────────────▲───────────────────────────────────┘
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

<img width="954" alt="image" src="https://github.com/user-attachments/assets/963b3fac-2eb3-411f-a88f-87635958bf5b">

### dev

### screencasts and screenshots


https://github.com/user-attachments/assets/fba60beb-c5ae-42ba-97b4-e9564a74b722

<img width="1024" alt="image" src="https://github.com/user-attachments/assets/d20189c4-3f13-4595-b0b5-b5fdc11cf518">

