export default function handler(req, res) {
  try {
    // Parse URL parameters
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 400;
    const height = parseInt(url.searchParams.get('height')) || 200; // Shorter default
    const header = url.searchParams.get('header') || 'Add CSAT Block';
    const emoji = url.searchParams.get('emoji') || '🔍';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';

    // Font family
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Optimized sizing for email columns (works well from 180px to 600px)
    const emojiSize = Math.max(Math.min(width * 0.15, 48), 24);  // Scale with width, reasonable limits
    const headerSize = Math.max(Math.min(width * 0.045, 20), 12); // Scale with width, readable limits

    // Simple 2-element layout - icon above, text below
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  
  <!-- Icon centered at 35% -->
  <text x="50%" y="35%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header centered at 65% -->
  <text x="50%" y="65%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
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
