export default function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 1200;
    const height = parseInt(url.searchParams.get('height')) || 400;
    const header = url.searchParams.get('header') || 'Add Hero Content Block';
    const body = url.searchParams.get('body') || 'Please select your local hero content block';
    const emoji = url.searchParams.get('emoji') || '🖼️';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';

    // Accept custom sizes from URL parameters, or use defaults
    const emojiSize = parseInt(url.searchParams.get('emojiSize')) || 72;
    const headerSize = parseInt(url.searchParams.get('headerSize')) || 36;
    const bodySize = parseInt(url.searchParams.get('bodySize')) || 18;
    const emojiY = parseInt(url.searchParams.get('emojiY')) || 25;
    const bodyY = parseInt(url.searchParams.get('bodyY')) || 75;

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  <text x="50%" y="${emojiY}%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="system-ui">${emoji}</text>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="system-ui">${header}</text>
  ${body ? `<text x="50%" y="${bodyY}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="system-ui">${body}</text>` : ''}
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
  } catch (error) {
    res.status(500).send('Error generating image');
  }
}
