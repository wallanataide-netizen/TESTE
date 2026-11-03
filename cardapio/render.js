// Gera PNG (A4 300dpi) e PDF A4 a partir de cardapio.html
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: Number(process.env.SCALE || 2) });
  await p.goto('file://' + path.resolve(__dirname, 'cardapio.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  for (const id of ['p1', 'p2']) {
    await p.locator('#' + id).screenshot({ path: path.join(__dirname, `out/cardapio-${id === 'p1' ? '1-lanches' : '2-frango-picanha'}.png`) });
  }
  await p.addStyleTag({ content: '@page{size:1240px 1754px;margin:0} html,body{background:none} .page{margin:0;page-break-after:always}' });
  await p.pdf({ path: path.join(__dirname, 'out/cardapio-ronalds.pdf'), width: '1240px', height: '1754px', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
