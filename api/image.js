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
    
    // Font sizes - use custom or calculate relative sizes
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
      // Relative font sizes based on SVG viewport units
      // These percentages will scale with the image size when displayed
      emojiSize = width * 0.095;  // ~9.5% of width (38px at 400px = 9.5%)
      headerSize = width * 0.06;  // ~6% of width (24px at 400px = 6%)
      bodySize = width * 0.035;   // ~3.5% of width (14px at 400px = 3.5%)
      
      // Set reasonable min/max limits to prevent too small or too large text
      emojiSize = Math.max(Math.min(emojiSize, 80), 20);
      headerSize = Math.max(Math.min(headerSize, 48), 12);
      bodySize = Math.max(Math.min(bodySize, 28), 8);
    }

    // Font family
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Content area positioning (same as before)
    const contentAreaHeight = 50; // 50% of image height for content
    const contentStartY = 50 - (contentAreaHeight / 2); // Center the content area vertically
    
    // Element positions within the content area
    const emojiOffsetInContent = 0;    // 0% of content area (top)
    const headerOffsetInContent = 50;  // 50% of content area (middle)
    const bodyOffsetInContent = 100;   // 100% of content area (bottom)
    
    // Calculate final positions
    const emojiY = contentStartY + (emojiOffsetInContent * contentAreaHeight / 100);
    const headerY = contentStartY + (headerOffsetInContent * contentAreaHeight / 100);
    const bodyY = contentStartY + (bodyOffsetInContent * contentAreaHeight / 100);

    // Layout positioning override
    let finalEmojiY, finalHeaderY, finalBodyY;
    
    switch (layout) {
      case 'compact':
        const compactContentHeight = 40;
        const compactStartY = 50 - (compactContentHeight / 2);
        finalEmojiY = compactStartY + (0 * compactContentHeight / 100);
        finalHeaderY = compactStartY + (40 * compactContentHeight / 100);
        finalBodyY = compactStartY + (100 * compactContentHeight / 100);
        break;
      case 'minimal':
        const minimalContentHeight = 30;
        const minimalStartY = 50 - (minimalContentHeight / 2);
        finalEmojiY = minimalStartY + (0 * minimalContentHeight / 100);
        finalHeaderY = minimalStartY + (100 * minimalContentHeight / 100);
        finalBodyY = null;
        break;
      case 'vertical':
      default:
        finalEmojiY = emojiY;
        finalHeaderY = headerY;
        finalBodyY = body.trim() ? bodyY : null;
        break;
    }

    // Generate SVG with viewBox for perfect scaling
    const svg = `
<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#${stroke}" stroke-width="1"/>
  
  <!-- Emoji -->
  <text x="50%" y="${finalEmojiY}%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header -->
  <text x="50%" y="${finalHeaderY}%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
  
  ${finalBodyY && body.trim() ? `<!-- Body -->
  <text x="50%" y="${finalBodyY}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${body}</text>` : ''}
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
