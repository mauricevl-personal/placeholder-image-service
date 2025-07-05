export default function handler(req, res) {
  try {
    // Parse URL parameters
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 400;
    const height = parseInt(url.searchParams.get('height')) || 200;
    const header = url.searchParams.get('header') || 'Add CSAT Block';
    const body = url.searchParams.get('body') || '';
    const emoji = url.searchParams.get('emoji') || '⭐';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';
    const stroke = url.searchParams.get('stroke') || 'dddddd';
    const layout = url.searchParams.get('layout') || 'vertical';
    
    // Font sizes - use custom or fallback to responsive
    const customEmojiSize = url.searchParams.get('emojiSize');
    const customHeaderSize = url.searchParams.get('headerSize');
    const customBodySize = url.searchParams.get('bodySize');
    
    let emojiSize, headerSize, bodySize;
    
    if (customEmojiSize && customHeaderSize && customBodySize) {
      // Use custom sizes from form
      emojiSize = parseInt(customEmojiSize);
      headerSize = parseInt(customHeaderSize);
      bodySize = parseInt(customBodySize);
    } else {
      // Use responsive sizing (original logic)
      emojiSize = Math.max(Math.min(width * 0.15, 48), 24);
      headerSize = Math.max(Math.min(width * 0.045, 20), 12);
      bodySize = Math.max(Math.min(width * 0.035, 16), 10);
    }

    // Font family
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Layout positioning
    let emojiY, headerY, bodyY;
    
    switch (layout) {
      case 'compact':
        // Icon and header closer together, body separate
        emojiY = 30;
        headerY = 45;
        bodyY = 70;
        break;
      case 'minimal':
        // Just icon and header, no body
        emojiY = 40;
        headerY = 60;
        bodyY = null; // Don't show body
        break;
      case 'vertical':
      default:
        // Evenly spaced vertical layout
        if (body.trim()) {
          emojiY = 25;
          headerY = 50;
          bodyY = 75;
        } else {
          // No body text, center icon and header
          emojiY = 35;
          headerY = 65;
          bodyY = null;
        }
        break;
    }

    // Generate SVG
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#${stroke}" stroke-width="1"/>
  
  <!-- Emoji -->
  <text x="50%" y="${emojiY}%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header -->
  <text x="50%" y="${headerY}%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
  
  ${bodyY && body.trim() ? `<!-- Body -->
  <text x="50%" y="${bodyY}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${body}</text>` : ''}
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
