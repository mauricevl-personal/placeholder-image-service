export default function handler(req, res) {
  try {
    // Parse URL parameters
    const url = new URL(req.url, `https://${req.headers.host}`);
    const width = parseInt(url.searchParams.get('width')) || 600; // Default to larger base size
    const height = parseInt(url.searchParams.get('height')) || 300;
    const header = url.searchParams.get('header') || 'Add CSAT Block';
    const body = url.searchParams.get('body') || '';
    const emoji = url.searchParams.get('emoji') || '⭐';
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';
    const stroke = url.searchParams.get('stroke') || 'dddddd';
    const layout = url.searchParams.get('layout') || 'vertical';
    
    // Check if this is a responsive request (add &responsive=true to URL)
    const isResponsive = url.searchParams.get('responsive') === 'true';
    
    // Font sizes based on the actual SVG canvas size, not display size
    // This ensures consistent optical appearance regardless of how the image is displayed
    let emojiSize, headerSize, bodySize;
    
    const customEmojiSize = url.searchParams.get('emojiSize');
    const customHeaderSize = url.searchParams.get('headerSize');
    const customBodySize = url.searchParams.get('bodySize');
    
    if (customEmojiSize && customHeaderSize && customBodySize) {
      // Use custom sizes from form
      emojiSize = parseInt(customEmojiSize);
      headerSize = parseInt(customHeaderSize);
      bodySize = parseInt(customBodySize);
    } else {
      // Calculate font sizes as percentages of the SVG viewBox width
      // These will appear optically consistent when the SVG is scaled
      emojiSize = Math.max(width * 0.08, 24);  // 8% of width, min 24px
      headerSize = Math.max(width * 0.04, 16); // 4% of width, min 16px  
      bodySize = Math.max(width * 0.024, 12);  // 2.4% of width, min 12px
      
      // Set reasonable maximums
      emojiSize = Math.min(emojiSize, 80);
      headerSize = Math.min(headerSize, 48);
      bodySize = Math.min(bodySize, 28);
    }

    // Font family
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Content area positioning
    const contentAreaHeight = 50;
    const contentStartY = 50 - (contentAreaHeight / 2);
    
    const emojiOffsetInContent = 0;
    const headerOffsetInContent = 50;
    const bodyOffsetInContent = 100;
    
    const emojiY = contentStartY + (emojiOffsetInContent * contentAreaHeight / 100);
    const headerY = contentStartY + (headerOffsetInContent * contentAreaHeight / 100);
    const bodyY = contentStartY + (bodyOffsetInContent * contentAreaHeight / 100);

    // Layout positioning
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

    // Generate SVG - remove viewBox to prevent scaling issues in email editors
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
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
