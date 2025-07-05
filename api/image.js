export default function handler(req, res) {
  try {
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

    // Create a responsive SVG that maintains aspect ratio
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${width} ${height}" 
     style="width: 100%; height: auto; max-width: 100%;"
     preserveAspectRatio="xMidYMid meet">
  
  <rect width="100%" height="100%" fill="#${bg}"/>
  <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#${stroke}" stroke-width="1"/>
  
  <!-- Use font sizes that scale with the viewBox -->
  <text x="50%" y="25%" text-anchor="middle" dominant-baseline="middle" 
        font-size="${width * 0.08}" font-family="${fontFamily}">${emoji}</text>
  
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
        font-size="${width * 0.04}" font-weight="bold" fill="#${text}" font-family="${fontFamily}">${header}</text>
  
  ${body.trim() ? `<text x="50%" y="75%" text-anchor="middle" dominant-baseline="middle" 
        font-size="${width * 0.023}" fill="#${text}" font-family="${fontFamily}">${body}</text>` : ''}
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(svg);
    
  } catch (error) {
    res.status(500).send('Error generating image');
  }
}
