// Tiny static-file server for the LeadsPlease® Intent Data marketing
// microsite. Static-only — Intent Data delivery lives behind the
// Data API and DataWidget.
//
//   /                      → marketing landing page
//   /_astro/*              → CSS + font assets
//   /health                → Railway healthcheck

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8768;

function setCacheHeaders(res, filePath) {
  if (filePath.includes('/_astro/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (filePath.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}

app.get('/health', function (req, res) {
  res.json({ ok: true, service: 'leadsplease-intent-data-microsite', uptime_s: Math.round(process.uptime()) });
});

app.use(express.static(path.join(__dirname), {
  setHeaders: setCacheHeaders,
  extensions: ['html'],
  index: 'index.html',
}));

app.listen(PORT, function () {
  console.log('LeadsPlease Intent Data microsite running on port ' + PORT);
  console.log('  http://localhost:' + PORT + '/');
});
