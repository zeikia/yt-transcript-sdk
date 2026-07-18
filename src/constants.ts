/**
 * [INPUT]: 无运行时依赖，维护第三方端点与语言展示配置
 * [OUTPUT]: 对内提供默认转录端点、语言名称映射及探测顺序
 * [POS]: src 的稳定配置层，被 transcript.ts 消费且不承载请求逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export const DEFAULT_TACTIQ_ENDPOINT = 'https://tactiq-apps-prod.tactiq.io/transcript';

export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese (Simplified)',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  hi: 'Hindi',
  it: 'Italian',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
  sv: 'Swedish',
  da: 'Danish',
  no: 'Norwegian',
  fi: 'Finnish',
  he: 'Hebrew',
  uk: 'Ukrainian',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
  bg: 'Bulgarian',
  hr: 'Croatian',
  sk: 'Slovak',
  sl: 'Slovenian',
  et: 'Estonian',
  lv: 'Latvian',
  lt: 'Lithuanian'
};

export const DEFAULT_LANGUAGE_PROBE_ORDER = [
  'en',
  'es',
  'fr',
  'de',
  'ja',
  'ko',
  'zh',
  'pt',
  'ru',
  'ar',
  'hi'
];
