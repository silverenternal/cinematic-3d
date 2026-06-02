// src/lib/markdown.js
// Tiny, safe-by-default Markdown -> HTML renderer.
// Handles the subset the profile README editor produces:
// headings, lists, blockquotes, links, images, code, bold/italic, hr, tables.

const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const escapeAttr = (s) => String(s).replace(/"/g, '&quot;');

function inline(s) {
  // protect code spans first
  const codeStash = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    codeStash.push(c);
    return `\u0000${codeStash.length - 1}\u0000`;
  });

  s = escapeHTML(s);

  // images
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) =>
    `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${title ? ` title="${escapeAttr(title)}"` : ''} loading="lazy" />`);

  // links
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, text, href, title) =>
    `<a href="${escapeAttr(href)}" target="_blank" rel="noopener"${title ? ` title="${escapeAttr(title)}"` : ''}>${text}</a>`);

  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // italic
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/(^|[^_])_([^_]+)_(?=$|[^_])/g, '$1<em>$2</em>');

  // restore code spans
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHTML(codeStash[+i])}</code>`);

  return s;
}

function renderTable(headerLine, alignLine, bodyLines) {
  const headers = headerLine.replace(/^\||\|$/g, '').split('|').map((s) => s.trim());
  const aligns  = alignLine.split('|').map((s) => s.trim());
  const alignAttr = aligns.map((a) => {
    if (/^:-+:$/.test(a)) return 'center';
    if (/^-+:$/.test(a))  return 'right';
    if (/^:-+$/.test(a))  return 'left';
    return '';
  });

  const ths = headers.map((h, i) => `<th style="text-align:${alignAttr[i] || 'left'}">${inline(h)}</th>`).join('');
  const rows = bodyLines.map((line) => {
    const cells = line.replace(/^\||\|$/g, '').split('|').map((s) => s.trim());
    return '<tr>' + cells.map((c, i) => `<td style="text-align:${alignAttr[i] || 'left'}">${inline(c)}</td>`).join('') + '</tr>';
  }).join('');

  return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function renderMarkdown(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, '').trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i]), i++;
      i++;
      out.push(`<pre><code${lang ? ` class="lang-${escapeAttr(lang)}"` : ''}>${escapeHTML(buf.join('\n'))}</code></pre>`);
      continue;
    }

    // hr
    if (/^-{3,}\s*$/.test(line) || /^\*{3,}\s*$/.test(line)) {
      out.push('<hr/>');
      i++;
      continue;
    }

    // heading
    let m;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
      const level = m[1].length;
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(buf.join(' '))}</blockquote>`);
      continue;
    }

    // table (header | align line)
    if (
      /\|/.test(line) &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])
    ) {
      const body = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        body.push(lines[i]);
        i++;
      }
      out.push(renderTable(line, lines[i - body.length - 1], body));
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      out.push('<ol>' + buf.map((it) => `<li>${inline(it)}</li>`).join('') + '</ol>');
      continue;
    }

    // unordered list (also supports - [ ] / - [x])
    if (/^\s*[-*+]\s+/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        const item = lines[i].replace(/^\s*[-*+]\s+/, '');
        const t = item.match(/^\[( |x|X)\]\s+(.*)$/);
        if (t) {
          const checked = (t[1] !== ' ').toString();
          buf.push(`<li class="todo"><input type="checkbox" disabled ${checked === 'true' ? 'checked' : ''}/> ${inline(t[2])}</li>`);
        } else {
          buf.push(`<li>${inline(item)}</li>`);
        }
        i++;
      }
      out.push('<ul>' + buf.join('') + '</ul>');
      continue;
    }

    // empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // paragraph (collect until blank)
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|>\s|`{3}|---$|.*\|.*\|\s*$)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  return out.join('\n');
}
