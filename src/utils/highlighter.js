// Dart + YAML syntax highlighter
// Returns an array of {text, type} tokens

const DART_KEYWORDS = new Set([
  'abstract','as','assert','async','await','base','break','case','catch',
  'class','const','continue','covariant','default','deferred','do','dynamic',
  'else','enum','export','extends','extension','external','factory','false',
  'final','finally','for','Function','get','hide','if','implements','import',
  'in','interface','is','late','library','mixin','new','null','on','operator',
  'override','part','required','rethrow','return','sealed','set','show',
  'static','super','switch','sync','this','throw','true','try','typedef',
  'var','void','when','while','with','yield',
])

const DART_TYPES = new Set([
  'int','double','num','bool','String','List','Map','Set','Object','dynamic',
  'Never','Null','Symbol','Type','Future','Stream','Iterable','Iterator',
  'Duration','DateTime','Uri','RegExp','Function','Record',
  'Widget','StatelessWidget','StatefulWidget','State','BuildContext',
  'Key','GlobalKey','UniqueKey','ValueKey',
  'Text','Column','Row','Container','Scaffold','AppBar','MaterialApp',
  'GetMaterialApp','ProviderScope',
  'Either','Left','Right','Option','Some','None',
  // common class suffixes will match via regex
])

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function highlightDart(code) {
  const lines = code.split('\n')
  return lines.map(line => highlightLine(line)).join('\n')
}

function highlightLine(line) {
  // Single-line comment
  const commentIdx = findCommentIndex(line)
  if (commentIdx === 0) {
    return `<span class="hl-comment">${escapeHtml(line)}</span>`
  }

  let code = commentIdx > 0 ? line.slice(0, commentIdx) : line
  const comment = commentIdx > 0 ? line.slice(commentIdx) : ''

  let result = tokenizeLine(code)
  if (comment) result += `<span class="hl-comment">${escapeHtml(comment)}</span>`
  return result
}

function findCommentIndex(line) {
  let inStr = false
  let strChar = ''
  for (let i = 0; i < line.length - 1; i++) {
    if (!inStr && (line[i] === '"' || line[i] === "'")) { inStr = true; strChar = line[i]; continue }
    if (inStr && line[i] === strChar && line[i-1] !== '\\') { inStr = false; continue }
    if (!inStr && line[i] === '/' && line[i+1] === '/') return i
  }
  return -1
}

function tokenizeLine(code) {
  let result = ''
  let i = 0

  while (i < code.length) {
    // String literals (single or double quoted, including multiline ''')
    if (code[i] === "'" || code[i] === '"') {
      const quote = code[i]
      let j = i + 1
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue }
        if (code[j] === quote) { j++; break }
        // handle ${} interpolation
        if (code[j] === '$' && code[j+1] === '{') {
          // emit string so far
          result += `<span class="hl-string">${escapeHtml(code.slice(i, j))}</span>`
          // find matching }
          let depth = 1; let k = j + 2
          while (k < code.length && depth > 0) {
            if (code[k] === '{') depth++
            if (code[k] === '}') depth--
            k++
          }
          result += `<span class="hl-punctuation">\${</span>`
          result += tokenizeLine(code.slice(j + 2, k - 1))
          result += `<span class="hl-punctuation">}</span>`
          i = k
          quote && (i = k)
          // restart outer string
          result += `<span class="hl-string">${escapeHtml(quote)}</span>`
          j = k
          i = k
          break
        }
        j++
      }
      if (j > i) {
        result += `<span class="hl-string">${escapeHtml(code.slice(i, j))}</span>`
        i = j
      } else { i++ }
      continue
    }

    // Annotation @something
    if (code[i] === '@') {
      let j = i + 1
      while (j < code.length && /\w/.test(code[j])) j++
      result += `<span class="hl-annotation">${escapeHtml(code.slice(i, j))}</span>`
      i = j
      continue
    }

    // Number literals
    if (/[0-9]/.test(code[i]) && (i === 0 || !/\w/.test(code[i-1]))) {
      let j = i
      while (j < code.length && /[0-9._xXa-fA-F]/.test(code[j])) j++
      result += `<span class="hl-number">${escapeHtml(code.slice(i, j))}</span>`
      i = j
      continue
    }

    // Words (keywords, types, identifiers)
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i
      while (j < code.length && /[\w$]/.test(code[j])) j++
      const word = code.slice(i, j)

      if (DART_KEYWORDS.has(word)) {
        result += `<span class="hl-keyword">${escapeHtml(word)}</span>`
      } else if (DART_TYPES.has(word) || /^[A-Z]/.test(word)) {
        result += `<span class="hl-type">${escapeHtml(word)}</span>`
      } else if (j < code.length && code[j] === '(') {
        result += `<span class="hl-function">${escapeHtml(word)}</span>`
      } else {
        result += escapeHtml(word)
      }
      i = j
      continue
    }

    // Punctuation / operators
    if (/[{}()\[\];,.<>=!+\-*/%&|^~?:]/.test(code[i])) {
      result += `<span class="hl-punctuation">${escapeHtml(code[i])}</span>`
      i++
      continue
    }

    result += escapeHtml(code[i])
    i++
  }

  return result
}

export function highlightYaml(code) {
  return code.split('\n').map(line => {
    // Comment
    if (/^\s*#/.test(line)) return `<span class="hl-comment">${escapeHtml(line)}</span>`
    // Key: value
    const keyMatch = line.match(/^(\s*)([\w_-]+)(\s*:)(.*)$/)
    if (keyMatch) {
      const [, indent, key, colon, rest] = keyMatch
      const highlightedRest = highlightYamlValue(rest)
      return `${escapeHtml(indent)}<span class="hl-yaml-key">${escapeHtml(key)}</span><span class="hl-punctuation">${escapeHtml(colon)}</span>${highlightedRest}`
    }
    // List item
    const listMatch = line.match(/^(\s*-\s*)(.*)$/)
    if (listMatch) {
      return `<span class="hl-punctuation">${escapeHtml(listMatch[1])}</span><span class="hl-string">${escapeHtml(listMatch[2])}</span>`
    }
    return escapeHtml(line)
  }).join('\n')
}

function highlightYamlValue(val) {
  if (!val.trim()) return escapeHtml(val)
  // String in quotes
  if (/^\s*['"]/.test(val)) return `<span class="hl-string">${escapeHtml(val)}</span>`
  // Boolean / null
  if (/^\s*(true|false|null|~)\s*$/.test(val)) return `<span class="hl-keyword">${escapeHtml(val)}</span>`
  // Number
  if (/^\s*[\d.]+\s*$/.test(val)) return `<span class="hl-number">${escapeHtml(val)}</span>`
  return `<span class="hl-string">${escapeHtml(val)}</span>`
}

export function highlight(filePath, code) {
  if (!filePath || !code) return escapeHtml(code || '')
  if (filePath.endsWith('.dart')) return highlightDart(code)
  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) return highlightYaml(code)
  return escapeHtml(code)
}
