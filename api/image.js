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

    // Updated font family with Noto Sans priority
    const fontFamily = '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

    // Header is always at 50%
    const headerY = 50;

    // Function to wrap body text at 35 characters per line, max 2 lines
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
            // Word is longer than 35 chars, truncate it
            lines.push(word.substring(0, 35));
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

    // Wrap the body text
    const bodyLines = wrapBodyText(body);

    // Generate SVG
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#${stroke}" stroke-width="1"/>
  
  <!-- Emoji -->
  <text x="50%" y="${emojiY}%" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header (always at 50%, single line) -->
  <text x="50%" y="${headerY}%" text-anchor="middle" dominant-baseline="middle" font-size="${headerSize}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header.substring(0, 20)}</text>
  
  ${bodyLines.length > 0 ? `<!-- Body (max 2 lines) -->
  ${bodyLines.map((line, index) => {
    const lineY = bodyY + (index * 6); // 6% spacing between lines
    return `<text x="50%" y="${lineY}%" text-anchor="middle" dominant-baseline="middle" font-size="${bodySize}" fill="#${text}" font-family="${fontFamily}">${line}</text>`;
  }).join('')}` : ''}
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
