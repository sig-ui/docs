export function normalizeRenderCode(html: string): string {
  // Strip Svelte block directives that can leak into generated HTML snippets.
  let normalized = html
    .replace(/\{#(if|each|await)[^}]*\}/g, "")
    .replace(/\{\/(if|each|await)\}/g, "")
    .replace(/\{@(?:const|html)[^}]*\}/g, "");

  normalized = stripEventHandlerAttributes(normalized);
  normalized = normalizeStaticAttributeExpressions(normalized);
  normalized = normalizeCustomElementAttributeNames(normalized);

  // Raw HTML parsing does not support self-closing custom elements.
  return normalized.replace(/<(sg-[a-z0-9-]+)(\s[^<>]*?)?\/>/gi, (_match, tag: string, attrs = "") => {
    return `<${tag}${attrs}></${tag}>`;
  });
}

export function normalizeStaticAttributeExpressions(input: string): string {
  let out = "";
  let i = 0;

  while (i < input.length) {
    if (!/\s/.test(input[i] ?? "")) {
      out += input[i] ?? "";
      i += 1;
      continue;
    }

    const attrStart = i;
    let j = i;
    while (j < input.length && /\s/.test(input[j] ?? "")) j += 1;

    const nameStart = j;
    if (!/[A-Za-z_:]/.test(input[j] ?? "")) {
      out += input.slice(i, j);
      i = j;
      continue;
    }

    j += 1;
    while (j < input.length && /[A-Za-z0-9_:.-]/.test(input[j] ?? "")) j += 1;
    const attrName = input.slice(nameStart, j);

    let k = j;
    while (k < input.length && /\s/.test(input[k] ?? "")) k += 1;
    if (input[k] !== "=") {
      out += input.slice(i, k);
      i = k;
      continue;
    }

    k += 1;
    while (k < input.length && /\s/.test(input[k] ?? "")) k += 1;
    if (input[k] !== "{") {
      out += input.slice(i, k);
      i = k;
      continue;
    }

    const expressionEnd = findBalancedExpressionEnd(input, k);
    if (expressionEnd === -1) {
      out += input.slice(i, k + 1);
      i = k + 1;
      continue;
    }

    const rawExpression = input.slice(k + 1, expressionEnd);
    const replacement = staticExpressionAttribute(attrName, rawExpression);
    out += replacement ?? input.slice(attrStart, expressionEnd + 1);
    i = expressionEnd + 1;
  }

  return out;
}

export function stripEventHandlerAttributes(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (/\s/.test(ch ?? "")) {
      let j = i;
      while (j < input.length && /\s/.test(input[j] ?? "")) j += 1;

      const nameStart = j;
      while (j < input.length && /[a-z-]/i.test(input[j] ?? "")) j += 1;
      const name = input.slice(nameStart, j).toLowerCase();

      let k = j;
      while (k < input.length && /\s/.test(input[k] ?? "")) k += 1;
      if (name.startsWith("on") && k < input.length && input[k] === "=") {
        k += 1;
        while (k < input.length && /\s/.test(input[k] ?? "")) k += 1;
        if (k < input.length && input[k] === "{") {
          const expressionEnd = findBalancedExpressionEnd(input, k);
          if (expressionEnd !== -1) {
            i = expressionEnd + 1;
            continue;
          }
        }
      }
    }
    out += ch ?? "";
    i += 1;
  }
  return out;
}

export function normalizeCustomElementAttributeNames(input: string): string {
  let out = "";
  let i = 0;

  while (i < input.length) {
    if (input[i] !== "<" || input[i + 1] === "/" || input.slice(i + 1, i + 4).toLowerCase() !== "sg-") {
      out += input[i] ?? "";
      i += 1;
      continue;
    }

    const tagEnd = findTagEnd(input, i);
    if (tagEnd === -1) {
      out += input.slice(i);
      break;
    }

    out += normalizeStartTagAttributeNames(input.slice(i, tagEnd + 1));
    i = tagEnd + 1;
  }

  return out;
}

function staticExpressionAttribute(attrName: string, rawExpression: string): string | null {
  const expr = rawExpression.trim();
  const htmlAttrName = toHtmlAttributeName(attrName);

  if (/^-?(?:\d+|\d*\.\d+)$/.test(expr)) {
    return ` ${htmlAttrName}="${expr}"`;
  }

  const quoted = parseStaticQuotedString(expr);
  if (quoted !== null) {
    return ` ${htmlAttrName}="${escapeAttributeValue(quoted)}"`;
  }

  const template = parseStaticTemplateLiteral(expr);
  if (template !== null) {
    return ` ${htmlAttrName}="${escapeAttributeValue(template)}"`;
  }

  const array = parseStaticScalarArray(expr);
  if (array !== null) {
    return ` ${htmlAttrName}="${escapeAttributeValue(array)}"`;
  }

  if (expr === "true") {
    return ` ${htmlAttrName}`;
  }

  if (expr === "false" || expr === "null" || expr === "undefined") {
    return "";
  }

  return null;
}

function findBalancedExpressionEnd(input: string, openBraceIndex: number): number {
  let depth = 0;
  let quote: "'" | "\"" | "`" | null = null;
  let escaped = false;

  for (let i = openBraceIndex; i < input.length; i += 1) {
    const ch = input[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === "'" || ch === "\"" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      continue;
    }

    if (ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function findTagEnd(input: string, tagStart: number): number {
  let quote: "'" | "\"" | null = null;

  for (let i = tagStart + 1; i < input.length; i += 1) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === "\"") {
      quote = ch;
      continue;
    }
    if (ch === ">") return i;
  }

  return -1;
}

function normalizeStartTagAttributeNames(tag: string): string {
  const nameMatch = tag.match(/^<sg-[^\s/>]+/i);
  if (!nameMatch) return tag;

  let out = nameMatch[0];
  let i = out.length;

  while (i < tag.length) {
    const ch = tag[i];
    if (ch === ">" || (ch === "/" && tag[i + 1] === ">")) {
      out += tag.slice(i);
      break;
    }

    if (/\s/.test(ch ?? "")) {
      let whitespaceEnd = i;
      while (whitespaceEnd < tag.length && /\s/.test(tag[whitespaceEnd] ?? "")) whitespaceEnd += 1;
      out += tag.slice(i, whitespaceEnd);
      i = whitespaceEnd;
      continue;
    }

    const attrStart = i;
    while (i < tag.length && !/[\s=/>]/.test(tag[i] ?? "")) i += 1;
    if (attrStart === i) {
      out += tag[i] ?? "";
      i += 1;
      continue;
    }

    out += toHtmlAttributeName(tag.slice(attrStart, i));

    while (i < tag.length && /\s/.test(tag[i] ?? "")) {
      out += tag[i];
      i += 1;
    }

    if (tag[i] !== "=") continue;

    out += tag[i];
    i += 1;

    while (i < tag.length && /\s/.test(tag[i] ?? "")) {
      out += tag[i];
      i += 1;
    }

    if (tag[i] === "\"" || tag[i] === "'") {
      const quote = tag[i];
      out += quote;
      i += 1;
      while (i < tag.length) {
        out += tag[i];
        if (tag[i] === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    while (i < tag.length && !/[\s>]/.test(tag[i] ?? "")) {
      out += tag[i];
      i += 1;
    }
  }

  return out;
}

function parseStaticQuotedString(expr: string): string | null {
  const quote = expr[0];
  if ((quote !== "\"" && quote !== "'") || expr[expr.length - 1] !== quote) return null;
  return unescapeJsStringContent(expr.slice(1, -1));
}

function parseStaticTemplateLiteral(expr: string): string | null {
  if (expr[0] !== "`" || expr[expr.length - 1] !== "`") return null;
  const content = expr.slice(1, -1);
  if (hasUnescapedInterpolation(content)) return null;
  return unescapeJsStringContent(content);
}

function parseStaticScalarArray(expr: string): string | null {
  if (!expr.startsWith("[") || !expr.endsWith("]")) return null;
  const content = expr.slice(1, -1).trim();
  if (!content) return "";
  if (!/^-?(?:\d+|\d*\.\d+)(?:\s*,\s*-?(?:\d+|\d*\.\d+))*\s*,?$/.test(content)) return null;
  return content.replace(/,\s*$/, "").split(/\s*,\s*/).join(",");
}

function hasUnescapedInterpolation(content: string): boolean {
  let escaped = false;
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "$" && content[i + 1] === "{") return true;
  }
  return false;
}

function unescapeJsStringContent(content: string): string {
  return content
    .replace(/\\`/g, "`")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, "\"")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function toHtmlAttributeName(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
