/**
 * AUT-006: Helper Konversi Markdown ke Lexical AST
 * Memungkinkan AI Agent mengirim artikel dalam format Markdown teks alami,
 * dan mengonversinya secara deterministik ke pohon Lexical JSON tanpa menebak format.
 */

export interface LexicalNode {
  type: string
  version: number
  [key: string]: any
}

export function convertMarkdownToLexical(markdown: string): { root: LexicalNode } {
  const lines = markdown.split(/\r?\n/)
  const children: LexicalNode[] = []

  let currentParagraphText: string[] = []

  const flushParagraph = () => {
    if (currentParagraphText.length > 0) {
      const text = currentParagraphText.join(' ').trim()
      if (text) {
        children.push({
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          children: [
            {
              type: 'text',
              version: 1,
              text,
              format: 0,
              mode: 'normal',
              style: '',
              detail: 0,
            },
          ],
        })
      }
      currentParagraphText = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // 1. Baris Kosong
    if (!line) {
      flushParagraph()
      continue
    }

    // 2. Heading (# H1, ## H2, ### H3, #### H4)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      children.push({
        type: 'heading',
        version: 1,
        tag: `h${level}`,
        format: '',
        indent: 0,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            version: 1,
            text,
            format: 0,
            mode: 'normal',
            style: '',
            detail: 0,
          },
        ],
      })
      continue
    }

    // 3. Blockquote (> ...)
    if (line.startsWith('>')) {
      flushParagraph()
      const quoteText = line.replace(/^>\s*/, '').trim()
      children.push({
        type: 'quote',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            version: 1,
            text: quoteText,
            format: 0,
            mode: 'normal',
            style: '',
            detail: 0,
          },
        ],
      })
      continue
    }

    // 4. Horizontal Rule (--- atau ***)
    if (/^([-*_]){3,}$/.test(line)) {
      flushParagraph()
      children.push({
        type: 'horizontalrule',
        version: 1,
      })
      continue
    }

    // 5. Unordered List (- atau *)
    if (/^[-*]\s+(.+)$/.test(line)) {
      flushParagraph()
      const listText = line.replace(/^[-*]\s+/, '').trim()
      children.push({
        type: 'list',
        version: 1,
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        children: [
          {
            type: 'listitem',
            version: 1,
            value: 1,
            format: '',
            indent: 0,
            direction: 'ltr',
            children: [
              {
                type: 'text',
                version: 1,
                text: listText,
                format: 0,
                mode: 'normal',
                style: '',
                detail: 0,
              },
            ],
          },
        ],
      })
      continue
    }

    // 6. Normal Paragraph
    currentParagraphText.push(line)
  }

  flushParagraph()

  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children,
    },
  }
}
