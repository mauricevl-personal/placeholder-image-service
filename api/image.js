export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract parameters with defaults
    const width = Math.min(Math.max(parseInt(searchParams.get('width')) || 400, 100), 1200);
    const height = Math.min(Math.max(parseInt(searchParams.get('height')) || 300, 100), 1200);
    const header = searchParams.get('header') || 'Placeholder';
    const body = searchParams.get('body') || 'Image';
    const emoji = searchParams.get('emoji') || '🎨';
    const bg = searchParams.get('bg') || 'f3f4f6';
    const text = searchParams.get('text') || '374151';

    // Calculate font sizes
    const emojiSize = Math.min(width, height) * 0.15;
    const headerSize = Math.min(width, height) * 0.08;
    const bodySize = Math.min(width, height) * 0.04;

    // Generate SVG
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="100%" height="100%" fill="#${bg}" />
      
      <!-- Border -->
      <rect x="1" y="1" width="${width-2}" height="${height-2}" 
            fill="none" stroke="#e5e7eb" stroke-width="2" />
      
      <!-- Emoji -->
      <text x="${width/2}" y="${height * 0.3}" 
            text-anchor="middle" dominant-baseline="middle" 
            font-size="${emojiSize}px" font-family="Arial, sans-serif">
        ${emoji}
      </text>
      
      <!-- Header Text -->
      <text x="${width/2}" y="${height * 0.5}" 
            text-anchor="middle" dominant-baseline="middle" 
            font-size="${headerSize}px" font-weight="bold" 
            font-family="Arial, sans-serif" fill="#${text}">
        ${header}
      </text>
      
      <!-- Body Text -->
      <text x="${width/2}" y="${height * 0.65}" 
            text-anchor="middle" dominant-baseline="middle" 
            font-size="${bodySize}px" 
            font-family="Arial, sans-serif" fill="#${text}" opacity="0.8">
        ${body}
      </text>
    </svg>`;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    
    // Return error SVG
    const errorSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fee2e2" />
      <text x="200" y="150" text-anchor="middle" font-size="16px" fill="#dc2626">
        Error generating image
      </text>
    </svg>`;
    
    return new Response(errorSvg, {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}
