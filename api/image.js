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

    // Simple SVG template with reduced spacing, larger header, and button
    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#ddd" stroke-width="1"/>
  
  <!-- Emoji -->
  <text x="50%" y="25%" text-anchor="middle" font-size="40" font-family="Arial">${emoji}</text>
  
  <!-- Header (increased to 24px) -->
  <text x="50%" y="40%" text-anchor="middle" font-size="24" font-weight="bold" fill="#${text}" font-family="Arial">${header}</text>
  
  <!-- Body -->
  <text x="50%" y="55%" text-anchor="middle" font-size="14" fill="#${text}" font-family="Arial">${body}</text>
  
  <!-- Button with rounded corners -->
  <rect x="${width/2 - 50}" y="${height * 0.7}" width="100" height="30" fill="#04A56F" rx="6" ry="6"/>
  
  <!-- Button text -->
  <text x="50%" y="${height * 0.7 + 20}" text-anchor="middle" font-size="14" font-weight="bold" fill="white" font-family="Arial">Replace</text>
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
