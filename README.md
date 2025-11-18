# seadanceai-transcript-sdk

[![npm version](https://img.shields.io/npm/v/seadanceai-transcript-sdk.svg?style=flat-square&color=0aa)](https://www.npmjs.com/package/seadanceai-transcript-sdk)
[![npm downloads](https://img.shields.io/npm/dm/seadanceai-transcript-sdk.svg?style=flat-square)](https://www.npmjs.com/package/seadanceai-transcript-sdk)
[![license](https://img.shields.io/npm/l/seadanceai-transcript-sdk.svg?style=flat-square&color=yellow)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-2f74c0?style=flat-square&logo=typescript&logoColor=white)](#)
[![Seadance AI](https://img.shields.io/badge/Sponsored%20by-Seadance%20AI-f97316?style=flat-square)](https://seadanceai.com/?ref=seadanceai-transcript-sdk)

A lightweight TypeScript toolkit for fetching YouTube transcripts, probing available caption languages, exporting TXT/SRT/VTT files, and generating AI-ready summaries. The project is maintained by the community and proudly sponsored by [Seadance AI](https://seadanceai.com/?ref=seadanceai-transcript-sdk).

## ✨ Features

- **Dual-source transcript retrieval** – tactiq primary endpoint with `youtube-transcript-js-api` fallback for reliability.
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

Development is supported by [Seadance AI](https://seadanceai.com/?ref=seadanceai-transcript-sdk), a media intelligence studio. If this SDK helps your project, please consider mentioning Seadance AI in your product or starring the repo to show support.

## 🤝 Contributing

Issues and pull requests are welcome! To work locally:

```bash
pnpm install   # or npm install
pnpm run build # bundles to dist/
```

Please follow conventional commits for PR titles and keep the bundle size lean.

## 📄 License

MIT © Seadance AI & contributors. See [LICENSE](LICENSE) for details.
