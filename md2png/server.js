const express = require("express");
const puppeteer = require("puppeteer-core");
const { marked } = require("marked");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.text({ limit: "50mb", type: "text/markdown" }));

const CHROMIUM_PATH = process.env.CHROMIUM_PATH || "/usr/bin/chromium";
const PORT = process.env.PORT || 3000;

// Reuse a single browser instance
let browser;
async function getBrowser() {
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({
      executablePath: CHROMIUM_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      headless: true,
    });
  }
  return browser;
}

function wrapHtml(markdown) {
  const body = marked.parse(markdown);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #24292e;
      background: #fff;
      padding: 2rem 2.5rem;
      max-width: 900px;
      margin: 0;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.9em;
      background: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }
    pre {
      background: #f6f8fa;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
    }
    pre code { background: none; padding: 0; }
    blockquote {
      margin: 0;
      padding: 0 1em;
      color: #6a737d;
      border-left: 4px solid #dfe2e5;
    }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #dfe2e5; padding: 0.5em 1em; }
    th { background: #f6f8fa; font-weight: 600; }
    tr:nth-child(even) td { background: #f6f8fa; }
    img { max-width: 100%; }
    hr { border: none; border-top: 1px solid #eaecef; margin: 1.5em 0; }
    /* Mermaid diagrams */
    .mermaid { margin: 1.5em 0; }
    .mermaid svg { max-width: 100%; height: auto; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>${body}</body>
</html>`;
}

// POST /render
// Body: raw markdown text (Content-Type: text/markdown or text/plain)
//    or JSON { markdown: "...", width: 900, fullPage: true }
app.post("/render", async (req, res) => {
  try {
    let markdown, width, fullPage;

    if (typeof req.body === "string") {
      markdown = req.body;
      width = 900;
      fullPage = true;
    } else {
      ({ markdown, width = 900, fullPage = true } = req.body);
    }

    if (!markdown) {
      return res.status(400).json({ error: "Missing markdown content" });
    }

    const html = wrapHtml(markdown);
    const b = await getBrowser();
    const page = await b.newPage();

    await page.setViewport({ width, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Convert <pre><code class="language-mermaid"> blocks into <div class="mermaid">
    // then initialise and run Mermaid
    await page.evaluate(async () => {
      document.querySelectorAll("pre code.language-mermaid").forEach((code) => {
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = code.textContent;
        code.parentElement.replaceWith(div);
      });

      window.mermaid.initialize({ startOnLoad: false, theme: "forest" });
      await window.mermaid.run();
    });

    const png = await page.screenshot({ type: "png", fullPage });
    await page.close();

    res.set("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`md2png listening on :${PORT}`));
