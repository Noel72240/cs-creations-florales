/**
 * Génère docs/MODE-EMPLOI-CHARLENE.pdf à partir du Markdown (Chrome headless).
 * Usage : node scripts/generate-mode-emploi-pdf.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const mdPath = join(root, 'docs', 'MODE-EMPLOI-CHARLENE.md')
const htmlPath = join(root, 'docs', 'MODE-EMPLOI-CHARLENE.html')
const pdfPath = join(root, 'docs', 'MODE-EMPLOI-CHARLENE.pdf')

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
]

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chrome) {
  console.error('Chrome ou Edge introuvable pour la génération PDF.')
  process.exit(1)
}

const md = readFileSync(mdPath, 'utf8')
const body = marked.parse(md, { gfm: true, breaks: false })

const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Mode d'emploi — C&amp;S Créations Florales</title>
  <style>
    @page { margin: 18mm 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #2d2a32;
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
    h1 {
      color: #5c3d6e;
      font-size: 22pt;
      border-bottom: 3px solid #c9a0dc;
      padding-bottom: 0.35em;
      margin-top: 0;
      page-break-after: avoid;
    }
    h2 {
      color: #5c3d6e;
      font-size: 14pt;
      margin-top: 1.4em;
      border-bottom: 1px solid #e8ddf0;
      padding-bottom: 0.2em;
      page-break-after: avoid;
    }
    h3 { font-size: 12pt; color: #4a3558; page-break-after: avoid; }
    p, li { orphans: 3; widows: 3; }
    a { color: #5c3d6e; text-decoration: none; }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 1.5em 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.8em 0 1.2em;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f3eaf8;
      color: #5c3d6e;
      font-weight: 600;
    }
    tr:nth-child(even) td { background: #faf8fc; }
    blockquote {
      margin: 1em 0;
      padding: 0.6em 1em;
      border-left: 4px solid #c9a0dc;
      background: #faf6fd;
      color: #444;
    }
    code {
      font-family: Consolas, monospace;
      font-size: 9.5pt;
      background: #f4f0f7;
      padding: 0.1em 0.35em;
      border-radius: 3px;
    }
    ul, ol { padding-left: 1.4em; }
    li { margin: 0.25em 0; }
    strong { color: #3d2a4a; }
  </style>
</head>
<body>
${body}
</body>
</html>`

writeFileSync(htmlPath, html, 'utf8')

const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`
const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    fileUrl,
  ],
  { encoding: 'utf8', timeout: 60000 },
)

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || 'Échec Chrome headless')
  process.exit(result.status || 1)
}

if (!existsSync(pdfPath)) {
  console.error('PDF non créé :', pdfPath)
  process.exit(1)
}

console.log('PDF généré :', pdfPath)
