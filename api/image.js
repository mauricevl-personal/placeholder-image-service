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

    // Font family
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Arial, sans-serif';

    // Content positioning
    const emojiY = 25;
    const headerY = 50;
    const bodyY = 75;

    // Generate SVG with CSS container queries for responsive fonts
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    <![CDATA[
      .emoji-text { 
        font-family: ${fontFamily}; 
        text-anchor: middle; 
        dominant-baseline: middle;
        font-size: 48px; /* Default for 600px */
      }
      .header-text { 
        font-family: ${fontFamily}; 
        text-anchor: middle; 
        dominant-baseline: middle; 
        font-weight: bold; 
        fill: #${text};
        font-size: 24px; /* Default for 600px */
      }
      .body-text { 
        font-family: ${fontFamily}; 
        text-anchor: middle; 
        dominant-baseline: middle; 
        fill: #${text};
        font-size: 14px; /* Default for 600px */
      }
      
      /* Container-based responsive sizing */
      @media (max-width: 400px) {
        .emoji-text { font-size: 32px; }
        .header-text { font-size: 16px; }
        .body-text { font-size: 10px; }
      }
      
      @media (min-width: 401px) and (max-width: 500px) {
        .emoji-text { font-size: 38px; }
        .header-text { font-size: 20px; }
        .body-text { font-size: 12px; }
      }
    ]]>
  </style>
  
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#${stroke}" stroke-width="1"/>
  
  <!-- Emoji -->
  <text x="50%" y="${emojiY}%" class="emoji-text">${emoji}</text>
  
  <!-- Header -->
  <text x="50%" y="${headerY}%" class="header-text">${header}</text>
  
  ${body.trim() ? `<!-- Body -->
  <text x="50%" y="${bodyY}%" class="body-text">${body}</text>` : ''}
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
