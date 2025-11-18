# seadanceai-transcript-sdk

Developer-friendly toolkit for fetching YouTube transcripts, detecting supported caption languages, exporting SRT/VTT/TXT files, and generating lightweight AI-ready summaries. Built and maintained by [Seadance AI](https://seadanceai.com/?ref=npm-transcript-sdk).

## Highlights

- ? Dual-source transcript pipeline: primary Tactiq endpoint + `youtube-transcript-js-api` fallback
- ? Language detection helper that probes the most common locales in batches
- ? Formatters for TXT/SRT/VTT so you can ship downloads in seconds
- ⚙️ Tree-shakable ESM + CommonJS output, typed with TypeScript

## Quick Start

```bash
npm install seadanceai-transcript-sdk
```

```ts
import { TranscriptClient, formatTranscriptFile } from 'seadanceai-transcript-sdk';

const client = new TranscriptClient();
const transcript = await client.getTranscript('dQw4w9WgXcQ', 'en');

const file = formatTranscriptFile(transcript, 'srt');
await fs.promises.writeFile(file.filename, file.content);
```

Visit [seadanceai.com](https://seadanceai.com/?ref=npm-transcript-sdk) if you would like a hosted API key, dashboard, and higher throughput limits.

## Scripts

- `npm run build` – bundle to `dist/`
- `npm test` – coming soon

## License

MIT © Seadance AI
