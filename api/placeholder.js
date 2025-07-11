export default function handler(req, res) {
  try {
    // Parse URL parameters
    const url = new URL(req.url, `https://${req.headers.host}`);
    const type = url.searchParams.get('type') || 'large';
    const header = decodeURIComponent(url.searchParams.get('header') || 'Add Content Block');
    const body = decodeURIComponent(url.searchParams.get('body') || '');
    const emoji = decodeURIComponent(url.searchParams.get('emoji') || '⭐');
    const bg = url.searchParams.get('bg') || 'f3f4f6';
    const text = url.searchParams.get('text') || '374151';
    const stroke = url.searchParams.get('stroke') || 'dddddd';

    // Predefined settings for each type
    const typeSettings = {
      xlarge: {
        width: 1200,
        height: 400,
        emojiSize: 68,
        headerSize: 36,
        bodySize: 20,
        emojiY: 31,
        bodyY: 65
      },
      large: {
        width: 600,
        height: 300,
        emojiSize: 48,
        headerSize: 26,
        bodySize: 16,
        emojiY: 34,
        bodyY: 61
      },
      medium: {
        width: 300,
        height: 150,
        emojiSize: 32,
        headerSize: 24,
        bodySize: 16,
        emojiY: 24,
        bodyY: 72
      },
      small: {
        width: 200,
        height: 100,
        emojiSize: 28,
        headerSize: 18,
        bodySize: 14,
        emojiY: 28,
        bodyY: 71
      }
    };

    // Get settings for the requested type
    const settings = typeSettings[type] || typeSettings.large;
    const { width, height, emojiSize, headerSize, bodySize, emojiY, bodyY } = settings;

    // Clean system font family
    const fontFamily = 'system-ui, -apple-system, Arial, sans-serif';

    // Determine text handling based on type
    const isSmall = type === 'small';
    const isMedium = type === 'medium';
    const isLargeOrXLarge = type === 'large' || type === 'xlarge';

    // Header Y position - 45% for small, 50% for others
    const headerY = isSmall ? 45 : 50;

    // Function to wrap header text for small size (15 chars per line)
    function wrapHeaderText(text) {
      if (!text || text.trim() === '') return [];
      
      const words = text.trim().split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        
        if (testLine.length <= 15) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            lines.push(word.substring(0, 15));
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
      // Small: Wrap header in 2 lines (15 chars each), no body, header starts at 45%
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
    console.error('Placeholder API error:', error);
    res.status(500).send('Error generating placeholder');
  }
}
