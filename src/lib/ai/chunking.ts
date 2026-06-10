// ============================================================
// Text Chunking — CJK-optimised paragraph + sentence splitting
// ============================================================

export interface ChunkingOptions {
  chunkSize: number;   // max characters per chunk (default 512)
  chunkOverlap: number; // overlap characters (default 64)
}

const DEFAULT_OPTIONS: ChunkingOptions = {
  chunkSize: 512,
  chunkOverlap: 64,
};

// ============================================================
// Sentence splitting — handles CJK and Latin text
// ============================================================

const CJK_SENTENCE_END = /[。！？；\n]/;
const LATIN_SENTENCE_END = /[.!?;]\s/;
const ANY_SENTENCE_END = new RegExp(
  `(${CJK_SENTENCE_END.source})|(${LATIN_SENTENCE_END.source})`
);

/**
 * Split text into sentences, respecting CJK and Latin punctuation.
 */
function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    current += char;

    if (ANY_SENTENCE_END.test(char)) {
      const trimmed = current.trim();
      if (trimmed) {
        sentences.push(trimmed);
      }
      current = '';
    }
  }

  // Remaining text
  const remaining = current.trim();
  if (remaining) {
    sentences.push(remaining);
  }

  return sentences;
}

// ============================================================
// Paragraph splitting
// ============================================================

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// ============================================================
// Main chunking function
// ============================================================

export interface TextChunk {
  content: string;
  startIndex: number;
  endIndex: number;
  metadata?: {
    pageNumber?: number;
  };
}

/**
 * Split text into chunks with CJK-optimised logic.
 *
 * Strategy:
 * 1. Split by paragraphs first.
 * 2. If a paragraph exceeds chunkSize, split by sentences.
 * 3. Merge small sentences back together up to chunkSize.
 * 4. Apply overlap between chunks.
 */
export function chunkText(text: string, options?: Partial<ChunkingOptions>): TextChunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const chunks: TextChunk[] = [];

  if (!text || text.trim().length === 0) return chunks;

  const paragraphs = splitParagraphs(text);
  let globalOffset = 0;

  for (const paragraph of paragraphs) {
    const paraStart = text.indexOf(paragraph, globalOffset);
    if (paraStart === -1) continue;

    if (paragraph.length <= opts.chunkSize) {
      // Paragraph fits in a single chunk
      chunks.push({
        content: paragraph,
        startIndex: paraStart,
        endIndex: paraStart + paragraph.length,
      });
      globalOffset = paraStart + paragraph.length;
      continue;
    }

    // Paragraph is too large — split by sentences
    const sentences = splitSentences(paragraph);
    let sentenceBuffer = '';
    let bufferStart = paraStart;
    let sentenceOffset = paraStart;

    for (const sentence of sentences) {
      const sentenceStart = text.indexOf(sentence, sentenceOffset);
      if (sentenceStart === -1) continue;

      if (sentenceBuffer.length + sentence.length > opts.chunkSize && sentenceBuffer.length > 0) {
        // Flush buffer as a chunk
        chunks.push({
          content: sentenceBuffer.trim(),
          startIndex: bufferStart,
          endIndex: bufferStart + sentenceBuffer.length,
        });

        // Calculate overlap
        const overlapText = sentenceBuffer.slice(-opts.chunkOverlap);
        sentenceBuffer = overlapText;
        bufferStart = bufferStart + sentenceBuffer.length - overlapText.length;
      }

      sentenceBuffer += sentence;
      sentenceOffset = sentenceStart + sentence.length;
    }

    // Flush remaining buffer
    if (sentenceBuffer.trim()) {
      chunks.push({
        content: sentenceBuffer.trim(),
        startIndex: bufferStart,
        endIndex: bufferStart + sentenceBuffer.length,
      });
    }

    globalOffset = paraStart + paragraph.length;
  }

  return chunks;
}

/**
 * Estimate token count (rough: 1 CJK char ≈ 1 token, 4 Latin chars ≈ 1 token).
 */
export function estimateTokens(text: string): number {
  let tokens = 0;
  for (const char of text) {
    if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/.test(char)) {
      tokens += 1;
    } else {
      tokens += 0.25;
    }
  }
  return Math.ceil(tokens);
}
