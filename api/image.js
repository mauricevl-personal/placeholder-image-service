export default function handler(req, res) {
  try {
    // Parse URL parameters
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 600;
    const height = parseInt(url.searchParams.get('height')) || 300;
    const header = url.searchParams.get('header') || 'Add CSAT Block';
    const body = url.searchParams.get('body') || '';
    const emoji = url.searchParams.get('emoji') || '⭐';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';
    const stroke = url.searchParams.get('stroke') || 'dddddd';

    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Use SVG viewport units for truly responsive fonts
    // These will scale with the SVG's displayed size
    const emojiSize = '8vw';    // 8% of viewport width
    const headerSize = '4vw';   // 4% of viewport width  
    const bodySize = '2.3vw';   // 2.3% of viewport width

    // Generate SVG with viewport-relative sizing
    const svg = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
  <rect width="100" height="100" fill="#${bg}"/>
  <rect x="1" y="1" width="98" height="98" fill="none" stroke="#${stroke}" stroke-width="0.5"/>
  
  <!-- Emoji -->
  <text x="50" y="25" text-anchor="middle" dominant-baseline="middle" 
        font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header -->
  <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" 
        font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
  
  ${body.trim() ? `<!-- Body -->
  <text x="50" y="75" text-anchor="middle" dominant-baseline="middle" 
        font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${body}</text>` : ''}
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
    
  } catch (error) {
    res.status(500).send('Error generating image');
  }
}
