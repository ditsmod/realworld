import hljs from 'highlight.js';
import * as katex from 'katex';
import { Marked, Renderer, escape } from '@ts-stack/markdown';
export { Marked };

class MyRenderer extends Renderer {
  override image(href: string, title: string, text: string): string {
    let out = '<img src="' + href + '" alt="' + text + '"';

    if (title) {
      out += ' title="' + title + '"';
    }

    out += this.options.xhtml ? '/>' : '>';
    return out;
  }

  override heading(text: string, level: number, raw: string) {
    // The first level of header is only in the title of the publication, it is not allowed here.
    if (level == 1) {
      level = 2;
    }

    const regexp = /\s*{([^}]+)}\s*$/;
    const execArr = regexp.exec(text);
    let id: string;

    if (execArr) {
      text = text.replace(regexp, '');
      id = execArr[1];
    } else {
      id = text.toLocaleLowerCase().replace(/[^\wа-яіїє]+/gi, '-');
    }

    return `<h${level} id="${id}">${text}</h${level}>`;
  }

  override table(header: string, body: string) {
    return (
      '<table class="table table-bordered">\n' +
      +'<thead>\n' +
      header +
      '</thead>\n' +
      '<tbody>\n' +
      body +
      '</tbody>\n' +
      '</table>\n'
    );
  }

  override code(code: string, lang: string, escaped?: boolean) {
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>' + (escaped ? code : escape(code, true)) + '\n</code></pre>';
    }

    return (
      '<pre><code class="' +
      this.options.langPrefix +
      escape(lang, true) +
      '">' +
      (escaped ? code : escape(code, true)) +
      '\n</code></pre>\n'
    );
  }

  override link(href: string, title: string, text: string) {
    if (this.options.sanitize) {
      let prot = '';
      try {
        prot = decodeURIComponent(href)
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return '';
      }

      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
        return '';
      }
    }

    let out: string;

    // @todo See inserting more correct code than `window.location`.
    if (href.substring(0, 1) == '#') {
      out = '<a href="' + href + '"';
    } else {
      out = '<a href="' + href + '"';
    }

    if (href.substring(0, 3) === 'htt' || href.substring(0, 2) === '//') {
      out += ' target="_blank"';
    }

    if (title) {
      out += ' title="' + title + '"';
    }

    out += '>' + text + '</a>';

    return out;
  }
}

Marked.setOptions({
  renderer: new MyRenderer(),
  isNoP: true,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  // sanitizer: html => (new DomSanitizer).sanitize(SecurityContext.HTML, html),
  mangle: true,
  smartLists: false,
  silent: false,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  xhtml: false,

  highlight(code, lang) {
    // http://highlightjs.readthedocs.io/en/latest/css-classes-reference.html#language-names-and-aliases

    if (!lang || lang == 'text' || lang == 'plain') {
      return code;
    }

    if (lang.toLowerCase() == 'c#') {
      lang = 'cs';
    }

    try {
      return hljs.highlight(code, { language: lang }).value;
    } catch (err: any) {
      return `<div style="color: red">[syntax highlighting error: ${err.message}]</div>`;
    }
  },
});

function callback(match: string, param1: string, param2: string, param3: string) {
  // Input match: 1h23m12s
  // Output: 4992
  const p1 = +param1 || 0;
  const p2 = +param2 || 0;
  const p3 = +param3 || 0;
  const sum = p1 * 60 * 60 + p2 * 60 + p3;
  return 't=' + (sum || '');
}

Marked.setBlockRule(/^ *(@{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/, function (execArr) {
  const channel = execArr![2];
  const content = execArr![3];

  switch (channel) {
    case 'youtube': {
      const id = escape(content)
        .replace('https://youtu.be/', '')
        .replace('https://www.youtube.com/embed/', '')
        .replace('https://www.youtube.com/watch?v=', '')
        .replace(/&amp;/g, '&')
        .replace(/t=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/g, callback)
        .replace(/([&?])t=/, '$1start=');
      return `\n<iframe width="420" height="315" allowfullscreen frameBorder="0" src="https://www.youtube.com/embed/${id}"></iframe>\n`;
    }
    case 'katex': {
      try {
        return '\n<div>' + katex.renderToString(escape(content)) + '</div>\n';
      } catch (err: any) {
        return `<div style="color: red">[Formula error: ${err.message}]</div>`;
      }
    }
    default: {
      return `<div style="color: red">[Error: Channel "${channel}" for embedded code not recognized]</div>`;
    }
  }
});
