export default function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 600;
    const height = parseInt(url.searchParams.get('height')) || 300;
    const header = url.searchParams.get('header') || 'Add CSAT Block';
    const body = url.searchParams.get('body') || 'Please select your local CSAT block';
    const emoji = url.searchParams.get('emoji') || '⭐';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';

    // Large-optimized font sizes
    const emojiSize = 48;
    const headerSize = 24;
    const bodySize = 14;

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  <text x="50%" y="25%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="system-ui">${emoji}</text>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="system-ui">${header}</text>
  ${body ? `<text x="50%" y="75%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="system-ui">${body}</text>` : ''}
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
  } catch (error) {
    res.status(500).send('Error generating image');
  }
}
