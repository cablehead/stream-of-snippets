#!/usr/bin/env bash

deno check --unstable-sloppy-imports src/**/*.{ts,tsx}
deno lint --rules-exclude=no-explicit-any src/**/*.{ts,tsx}
deno fmt src/**/*.{ts,tsx}
