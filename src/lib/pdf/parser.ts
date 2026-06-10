import type { Source } from '@/types';

// ============================================================
// PDF Parser — uses pdfjs-dist
// ============================================================

export interface ParsedPDF {
  text: string;
  title: string;
  pageCount: number;
  metadata: Record<string, string>;
}

/**
 * Parse a PDF file (ArrayBuffer) and extract text content.
 */
export async function parsePDF(arrayBuffer: ArrayBuffer): Promise<ParsedPDF> {
  // Dynamic import of pdfjs-dist to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const metadata = await pdf.getMetadata().catch(() => null);
  const metaInfo: Record<string, string> = (metadata?.info as Record<string, string>) ?? {};

  const title =
    metaInfo['Title'] ||
    metaInfo['title'] ||
    'Untitled PDF';

  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    pages.push(pageText);
  }

  return {
    text: pages.join('\n\n'),
    title,
    pageCount: pdf.numPages,
    metadata: {
      title: title,
      author: metaInfo['Author'] || '',
      subject: metaInfo['Subject'] || '',
      creator: metaInfo['Creator'] || '',
      producer: metaInfo['Producer'] || '',
    },
  };
}

/**
 * Parse a text file content.
 */
export function parseText(content: string, filename: string): Omit<ParsedPDF, 'pageCount'> {
  return {
    text: content,
    title: filename.replace(/\.[^.]+$/, ''),
    metadata: {},
  };
}

/**
 * Parse a markdown file content.
 */
export function parseMarkdown(content: string, filename: string): Omit<ParsedPDF, 'pageCount'> {
  return {
    text: content,
    title: filename.replace(/\.[^.]+$/, ''),
    metadata: {},
  };
}

/**
 * Read a File object and determine its type, then parse accordingly.
 */
export async function parseFile(file: File): Promise<{ content: string; title: string; type: Source['type'] }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  switch (ext) {
    case 'pdf': {
      const buffer = await file.arrayBuffer();
      const parsed = await parsePDF(buffer);
      return { content: parsed.text, title: parsed.title, type: 'pdf' };
    }
    case 'txt': {
      const text = await file.text();
      const parsed = parseText(text, file.name);
      return { content: parsed.text, title: parsed.title, type: 'txt' };
    }
    case 'md':
    case 'markdown': {
      const text = await file.text();
      const parsed = parseMarkdown(text, file.name);
      return { content: parsed.text, title: parsed.title, type: 'md' };
    }
    default: {
      // Try reading as plain text
      const text = await file.text();
      return { content: text, title: file.name, type: 'txt' };
    }
  }
}
