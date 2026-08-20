export type DiaryBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'figure'; caption: string }
  | { type: 'bibliography'; text: string };

const FIGURE_START = /^Fig\.? \d+ - /;
const BIBLIOGRAPHY_START = /Bibliograf[ií]a/i;

/** Split diary body into paragraphs, figure captions, and bibliography. */
export function parseDiaryBlocks(body: string): DiaryBlock[] {
  const bibIndex = body.search(BIBLIOGRAPHY_START);
  const main = (bibIndex >= 0 ? body.slice(0, bibIndex) : body).trim();
  const bibliography = bibIndex >= 0 ? body.slice(bibIndex).trim() : '';

  const blocks: DiaryBlock[] = [];
  const chunks = main.split(/(?=Fig\.? \d+ - )/);

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if (FIGURE_START.test(trimmed)) {
      const { caption, rest } = splitFigureChunk(trimmed);
      if (caption) blocks.push({ type: 'figure', caption });
      if (rest) blocks.push({ type: 'paragraph', text: rest });
      continue;
    }

    blocks.push({ type: 'paragraph', text: trimmed });
  }

  if (bibliography) {
    blocks.push({ type: 'bibliography', text: bibliography });
  }

  return blocks;
}

function splitFigureChunk(chunk: string): { caption: string; rest: string } {
  const nested = chunk.split(/(?=Fig\.? \d+ - )/).filter(Boolean);

  if (nested.length > 1) {
    const captions = nested.map((part) => part.trim()).filter(Boolean);
    return {
      caption: captions.join(' '),
      rest: '',
    };
  }

  const withYear = chunk.match(/^((?:Fig\.? \d+ - ).+?\(\d{4}\))\s*([\s\S]*)$/);
  if (withYear) {
    return { caption: withYear[1].trim(), rest: withYear[2].trim() };
  }

  const shortCaption = chunk.match(/^((?:Fig\.? \d+ - )[^.]+\.)\s*([\s\S]*)$/);
  if (shortCaption) {
    return { caption: shortCaption[1].trim(), rest: shortCaption[2].trim() };
  }

  return { caption: chunk.trim(), rest: '' };
}
