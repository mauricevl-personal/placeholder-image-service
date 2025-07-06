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
    
    // Get custom font sizes and positions from URL parameters
    const customEmojiSize = url.searchParams.get('emojiSize');
    const customHeaderSize = url.searchParams.get('headerSize');
    const customBodySize = url.searchParams.get('bodySize');
    const customEmojiY = url.searchParams.get('emojiY');
    const customBodyY = url.searchParams.get('bodyY');
    
    let emojiSize, headerSize, bodySize, emojiY, bodyY;
    
    if (customEmojiSize && customHeaderSize && customBodySize) {
      // Use custom sizes from UI sliders
      emojiSize = parseInt(customEmojiSize);
      headerSize = parseInt(customHeaderSize);
      bodySize = parseInt(customBodySize);
      emojiY = parseInt(customEmojiY) || 25;
      bodyY = parseInt(customBodyY) || 75;
    } else {
      // Use responsive sizing (fallback for non-UI usage)
      emojiSize = Math.max(Math.min(width * 0.08, 48), 24);
      headerSize = Math.max(Math.min(width * 0.04, 24), 16);
      bodySize = Math.max(Math.min(width * 0.024, 16), 12);
      emojiY = 25;
      bodyY = 75;
    }

    // Clean system font family
    const fontFamily = 'system-ui, -apple-system, Arial, sans-serif';

    // Header is always at 50%
    const headerY = 50;

    // Determine text handling based on size
    const isSmall = width <= 200;
    const isMedium = width > 200 && width < 600;
    const isLargeOrXLarge = width >= 600;

    // Function to wrap header text for small size (10 chars per line)
    function wrapHeaderText(text) {
      if (!text || text.trim() === '') return [];
      
      const words = text.trim().split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        
        if (testLine.length <= 10) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Word is longer than 10 chars, truncate it
            lines.push(word.substring(0, 10));
            currentLine = '';
          }
        }
        
        // Stop at 2 lines max
        if (lines.length >= 2) break;
      }
      
      if (currentLine && lines.length < 2) {
        lines.push(currentLine);
      }
      
      return lines;
    }

    // Function to wrap body text for medium size (35 chars per line)
    function wrapBodyText(text) {
      if (!text || text.trim() === '') return [];
      
      const words = text.trim().split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        
        if (testLine.length <= 35) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            lines.push(word.substring(0, 35));
            currentLine = '';
          }
        }
        
        if (lines.length >= 2) break;
      }
      
      if (currentLine && lines.length < 2) {
        lines.push(currentLine);
      }
      
      return lines;
    }

    // Calculate line height as 1.1em relative to font size
    const headerLineHeight = headerSize * 1.1;
    const bodyLineHeight = bodySize * 1.1;

    // Generate text elements based on size
    let headerTextElements = '';
    let bodyTextElements = '';

    if (isSmall) {
      // Small: Wrap header in 2 lines, no body
      // Align top of first line to center (50%)
      const headerLines = wrapHeaderText(header);
      headerTextElements = headerLines.map((line, index) => {
        const lineY = headerY + (index * (headerLineHeight / height * 100));
        return `<text x="50%" y="${lineY}%" text-anchor="middle" dominant-baseline="text-before-edge" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${line}</text>`;
      }).join('\n  ');
    } else if (isMedium) {
      // Medium: Single line header, wrapped body
      headerTextElements = `<text x="50%" y="${headerY}%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header.substring(0, 20)}</text>`;
      
      const bodyLines = wrapBodyText(body);
      if (bodyLines.length > 0) {
        bodyTextElements = bodyLines.map((line, index) => {
          const lineY = bodyY + (index * (bodyLineHeight / height * 100));
          return `<text x="50%" y="${lineY}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${line}</text>`;
        }).join('\n  ');
      }
    } else {
      // Large/XLarge: Single line header, single line body
      headerTextElements = `<text x="50%" y="${headerY}%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header.substring(0, 20)}</text>`;
      
      if (body.trim()) {
        bodyTextElements = `<text x="50%" y="${bodyY}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${body.trim()}</text>`;
      }
    }

    // Generate SVG
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#${stroke}" stroke-width="1"/>
  
  <text x="50%" y="${emojiY}%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  ${headerTextElements}
  
  ${bodyTextElements}
</svg>`;

    // Set headers and return SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
    
  } catch (error) {
    console.error('SVG generation error:', error);
    res.status(500).send('Error generating image');
  }
}
