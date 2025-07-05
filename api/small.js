export default function handler(req, res) {
  const svg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <rect x="2" y="2" width="196" height="96" fill="none" stroke="#ddd" stroke-width="1"/>
  <text x="50%" y="30%" text-anchor="middle" dominant-baseline="middle" font-size="20" font-family="system-ui">⭐</text>
  <text x="50%" y="70%" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="bold" fill="#374151" font-family="system-ui">Add CSAT</text>
</svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(svg);
}
