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

    // Font family for all text
    const fontFamily = '-apple-system, "system-ui", "Segoe UI", "PingFang SC", HelveticaNeue';

    // Simple SVG template with tighter spacing and link
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  
  <!-- Emoji -->
  <text x="50%" y="25%" text-anchor="middle" font-size="40" font-family="${fontFamily}">${emoji}</text>
  
  <!-- Header (24px, bold) -->
  <text x="50%" y="35%" text-anchor="middle" font-size="24" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
  
  <!-- Body (16px) -->
  <text x="50%" y="50%" text-anchor="middle" font-size="16" fill="#${text}" font-family="${fontFamily}">${body}</text>
  
  <!-- Clickable Button with Link -->
  <a href="https://shamancloud.com" target="_blank">
    <rect x="${width/2 - 60}" y="${height * 0.62}" width="120" height="35" fill="#04A56F" rx="6" ry="6" style="cursor:pointer"/>
    <text x="50%" y="${height * 0.62 + 23}" text-anchor="middle" font-size="16" font-weight="normal" fill="white" font-family="${fontFamily}" style="cursor:pointer">Replace</text>
  </a>
  
  <!-- Link text -->
  <text x="50%" y="${height * 0.85}" text-anchor="middle" font-size="12" fill="#666" font-family="${fontFamily}">shamancloud.com</text>
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
