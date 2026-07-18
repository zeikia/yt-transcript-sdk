# src/
> L2 | 父级: ../AGENTS.md

成员清单

client.ts: SDK 门面，合并默认配置并协调转录、语言探测、摘要和格式化
constants.ts: 稳定配置，维护第三方端点、语言显示名和默认探测顺序
format.ts: 纯格式转换，生成 TXT、SRT、WebVTT 和可下载文件描述
format.test.ts: 格式契约测试，锁定 SRT 与 WebVTT 时间戳规范及异常时间归一化
index.ts: npm 公共入口，集中暴露函数、类型和 TranscriptClient
summary.ts: 纯文本分析，以启发式策略生成摘要、要点和问题
transcript.ts: 网络数据层，封装主服务、YouTube 回退、毫秒归一化与语言批量探测
transcript.test.ts: 降级路径测试，锁定第三方毫秒时间值到 SDK 秒契约的转换
types.ts: 共享边界类型，定义请求、响应、格式化和摘要契约
video.ts: 输入边界，验证受信 YouTube 主机并提取规范视频 ID
video.test.ts: URL 解析测试，覆盖常用路由、无协议输入和伪域名拒绝

[PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
