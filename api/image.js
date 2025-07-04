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

    // Fixed font sizes
    const emojiSize = 40;
    const headerSize = 24;
    const bodySize = 16;

    // Font family
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Calculate relative positions from header at 50%
    const headerPos = 50; // Header at 50% of height
    const spacing = 8; // Spacing in percentage points
    const emojiPos = headerPos - spacing; // Icon above header
    const bodyPos = headerPos + spacing; // Body below header

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  
  <!-- Emoji (above header) -->
  <text x="50%" y="${emojiPos}%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header (at 50%) -->
  <text x="50%" y="${headerPos}%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
  
  <!-- Body (below header) -->
  <text x="50%" y="${bodyPos}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${body}</text>
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
