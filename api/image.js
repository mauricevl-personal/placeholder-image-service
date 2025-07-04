export default function handler(req, res) {
  try {
    // Parse URL parameters
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = url.searchParams.get('width') || '400';
    const height = url.searchParams.get('height') || '300';
    const header = url.searchParams.get('header') || 'Placeholder';
    const body = url.searchParams.get('body') || 'Image';
    const emoji = url.searchParams.get('emoji') || '🎨';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';

    // Simple SVG template
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  <text x="50%" y="30%" text-anchor="middle" font-size="40" font-family="Arial">${emoji}</text>
  <text x="50%" y="50%" text-anchor="middle" font-size="20" font-weight="bold" fill="#${text}" font-family="Arial">${header}</text>
  <text x="50%" y="70%" text-anchor="middle" font-size="14" fill="#${text}" font-family="Arial">${body}</text>
</svg>`;

    // Set headers and return SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
    
  } catch (error) {
    // Return simple error
    res.status(500).send('Error generating image');
  }
}
