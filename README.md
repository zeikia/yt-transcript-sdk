# seadanceai-transcript-sdk

[![npm version](https://img.shields.io/npm/v/seadanceai-transcript-sdk.svg?style=flat-square&color=0aa)](https://www.npmjs.com/package/seadanceai-transcript-sdk)
[![npm downloads](https://img.shields.io/npm/dm/seadanceai-transcript-sdk.svg?style=flat-square)](https://www.npmjs.com/package/seadanceai-transcript-sdk)
[![license](https://img.shields.io/npm/l/seadanceai-transcript-sdk.svg?style=flat-square&color=yellow)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-2f74c0?style=flat-square&logo=typescript&logoColor=white)](#)
[![CI](https://github.com/SeaVid-AI/yt-transcript-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/SeaVid-AI/yt-transcript-sdk/actions/workflows/ci.yml)
[![Seavid AI](https://img.shields.io/badge/Sponsored%20by-Seavid%20AI-f97316?style=flat-square)](https://seavidgen.com/?ref=seadanceai-transcript-sdk)

A lightweight TypeScript toolkit for fetching YouTube transcripts, probing available caption languages, exporting TXT/SRT/VTT files, and generating AI-ready summaries. The source is available on [GitHub](https://github.com/SeaVid-AI/yt-transcript-sdk), and development is supported by [Seavid AI](https://seavidgen.com/?ref=seadanceai-transcript-sdk).

## ✨ Features

- **Dual-source transcript retrieval** – tactiq primary endpoint with a maintained, dependency-free `youtube-transcript` fallback.
- **Language probing** – batch-detect common caption languages to improve UX.
- **Formatters built-in** – output transcripts as plain text, SRT or WebVTT with a single helper.
- **Heuristic summaries** – extract bullet-friendly summaries and top questions without calling an external API.
- **Tree-shakable + typed** – ships both ESM/CJS bundles and `.d.ts` definitions.

## 📦 Installation

```bash
npm install seadanceai-transcript-sdk
# or
pnpm add seadanceai-transcript-sdk
# or
yarn add seadanceai-transcript-sdk
```

Node.js 20.19 or newer is required.

## ⚡ Quick Start

```ts
import {
  TranscriptClient,
  formatTranscriptFile,
  detectAvailableLanguages
} from 'seadanceai-transcript-sdk';

const client = new TranscriptClient({ enableFallback: true });

async function main() {
  const videoId = 'dQw4w9WgXcQ';

  // Fetch transcript
  const transcript = await client.getTranscript(videoId, 'en');

  // Convert to downloadable file
  const file = formatTranscriptFile(transcript, 'srt');
  await Bun.write(file.filename, file.content); // use fs/promises if you prefer

  // Discover languages
  const languages = await detectAvailableLanguages(videoId);
  console.log(languages.languages.map((lang) => lang.name));

  // Summary helpers
  const summary = client.summarize(transcript);
  console.log(summary.summary);
}

main();
```

## 🧩 API Overview

### `TranscriptClient`

| Method | Description |
| --- | --- |
| `getTranscript(videoId, language?, options?)` | Returns transcript snippets with primary + fallback strategy. |
| `detectLanguages(videoId, options?)` | Batch probes popular caption languages using tactiq. |
| `summarize(transcriptOrSnippets, options?)` | Generates a heuristic summary + key points + FAQ scaffold. |
| `format(transcript, format)` / `formatToFile(transcript, format)` | Converts transcript to TXT/SRT/VTT string or downloadable payload. |

### Helper exports

- `getTranscript`, `detectAvailableLanguages` – functional API if you do not want a client instance.
- `formatTranscript`, `formatTranscriptFile` – formatting helpers.
- `summarizeTranscript` – standalone summary function.
- Types (`TranscriptResponse`, `TranscriptSnippet`, etc.) are exported for strict typing.

Check [`src/`](./src) for the exact implementation details.

## 🙌 Sponsorship

Development is supported by [Seavid AI](https://seavidgen.com/?ref=seadanceai-transcript-sdk), an AI video and image creation platform. If this SDK helps your project, please consider mentioning Seavid AI in your product or starring the repo to show support.

## 🤝 Contributing

Issues and pull requests are welcome! To work locally:

```bash
pnpm install   # or npm install
pnpm run build # bundles to dist/
```

Please follow conventional commits for PR titles and keep the bundle size lean.

## Release process

Releases are published from GitHub Actions through npm Trusted Publishing. Maintainers can bump the version and push the generated tag:

```bash
npm version patch
git push origin master --follow-tags
```

The `publish.yml` workflow verifies, builds, and publishes the matching package version with npm provenance. No long-lived npm publish token is stored in GitHub.

## 📄 License

MIT (c) Seavid AI and contributors. See [LICENSE](LICENSE) for details.
