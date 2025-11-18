import type { SummaryQuestion, TranscriptSnippet, TranscriptSummaryOptions, TranscriptSummaryResult } from './types';

const DEFAULT_TITLE = 'YouTube Video';

export function summarizeTranscript(
  snippets: TranscriptSnippet[],
  options: TranscriptSummaryOptions = {}
): TranscriptSummaryResult {
  const title = options.title || DEFAULT_TITLE;
  const summary = buildSummary(snippets);
  const keyPoints = extractKeyPoints(snippets);
  const topQuestions = buildTopQuestions(title);
  const duration = estimateDuration(snippets);

  return {
    summary,
    keyPoints,
    topQuestions,
    duration
  };
}

function buildSummary(snippets: TranscriptSnippet[]): string {
  if (!snippets || !snippets.length) {
    return 'No transcript available for summary generation.';
  }

  const fullText = snippets.map((item) => item.text).join(' ');
  const sentences = fullText.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 10);

  const interval = Math.max(1, Math.floor(sentences.length / 5));
  const keySentences = sentences
    .filter((sentence, index) => {
      const lower = sentence.toLowerCase();
      const hasKeyword = ['important', 'key', 'main', 'first', 'second', 'finally', 'conclusion', 'summary'].some(
        (keyword) => lower.includes(keyword)
      );
      return hasKeyword || index % interval === 0;
    })
    .slice(0, 8);

  if (keySentences.length === 0) {
    return sentences.slice(0, 5).join('. ').trim();
  }

  return `${keySentences.join('. ').trim()}.`;
}

function extractKeyPoints(snippets: TranscriptSnippet[]): string[] {
  if (!snippets || snippets.length === 0) {
    return ['No key points available'];
  }

  const keyPoints: string[] = [];
  const interval = Math.max(1, Math.floor(snippets.length / 6));

  for (let i = 0; i < snippets.length; i += interval) {
    const item = snippets[i];
    if (!item?.text) continue;
    const text = item.text.trim();
    if (text.length > 15) {
      keyPoints.push(text.substring(0, 120) + (text.length > 120 ? '...' : ''));
    }
  }

  return keyPoints.length ? keyPoints : ['Key points extracted from video content'];
}

function buildTopQuestions(title: string): SummaryQuestion[] {
  return [
    {
      question: `What is the main topic of "${title}"?`,
      answer: `This video covers ${title.toLowerCase()} with detailed explanations and practical insights.`,
      timestamp: '00:00'
    },
    {
      question: 'What are the key takeaways from this video?',
      answer: 'The video provides comprehensive information with actionable insights and practical applications.',
      timestamp: '00:30'
    },
    {
      question: 'Who is the target audience for this content?',
      answer: 'This content is designed for viewers interested in the topics discussed in the video.',
      timestamp: '01:00'
    }
  ];
}

function estimateDuration(snippets: TranscriptSnippet[]): number {
  if (!snippets.length) {
    return 0;
  }

  const last = snippets[snippets.length - 1];
  const duration = typeof last.duration === 'number' ? last.duration : 0;
  return Math.round(last.start + duration);
}
