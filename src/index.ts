/**
 * [INPUT]: 汇聚 src 各能力模块的公共导出
 * [OUTPUT]: 对外提供 SDK 的函数、TranscriptClient 与 TypeScript 类型入口
 * [POS]: npm 包唯一公共入口，约束内部模块不被消费者直接耦合
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
export * from './types';
export { getVideoId, validateYouTubeUrl } from './video';
export { getTranscript, detectAvailableLanguages } from './transcript';
export { formatTranscript, formatTranscriptFile } from './format';
export { summarizeTranscript } from './summary';
export { TranscriptClient } from './client';
