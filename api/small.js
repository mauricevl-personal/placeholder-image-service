export default function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 200;
    const height = parseInt(url.searchParams.get('height')) || 100;
    const header = url.searchParams.get('header') || 'Add CSAT';
    const body = url.searchParams.get('body') || '';
    const emoji = url.searchParams.get('emoji') || '⭐';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';

    // Small-optimized font sizes
    const emojiSize = 20;
    const headerSize = 12;
    const bodySize = 10;

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  <text x="50%" y="30%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="system-ui">${emoji}</text>
  <text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="system-ui">${header}</text>
  ${body ? `<text x="50%" y="80%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="system-ui">${body}</text>` : ''}
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
  } catch (error) {
    res.status(500).send('Error generating image');
  }
}
