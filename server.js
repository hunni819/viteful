import fs from 'node:fs/promises';
import express from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 5175;
const BASE = process.env.BASE || '/';

const htmlTemplate = IS_PRODUCTION
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';

const ssrManifest = IS_PRODUCTION
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : '';

const app = express();

let vite;
if (!IS_PRODUCTION) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: BASE,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(BASE, sirv('./dist/client', { extensions: [] }));
}

const apiController = express.Router();

app.get('/api/test', (req, res) => {
  return res.status(200).json({ result: true });
});

app.use('*', apiController, async (req, res) => {
  try {
    const url = req.originalUrl.replace(BASE, '');

    let template;
    let render;
    if (!IS_PRODUCTION && vite) {
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = htmlTemplate;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url, ssrManifest);
    const html = template
      .replace(`<!--app-head-->`, rendered.seoHead(req.originalUrl) ?? '')
      .replace(`<!--app-html-->`, rendered.html(req.originalUrl) ?? '');

    res
      .status(200)
      .set({
        'Content-Type': 'text/html',
        // "Cache-Control": "public, max-age=10000",
      })
      .end(html);
  } catch (err) {
    console.log({ err });
    return res.json({ result: true });
  }
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
