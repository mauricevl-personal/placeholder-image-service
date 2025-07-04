import { ImageResponse } from '@vercel/og';

export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    
    // Extract parameters with defaults
    const width = Math.min(Math.max(parseInt(searchParams.get('width')) || 400, 100), 1200);
    const height = Math.min(Math.max(parseInt(searchParams.get('height')) || 300, 100), 1200);
    const header = decodeURIComponent(searchParams.get('header') || 'Placeholder');
    const body = decodeURIComponent(searchParams.get('body') || 'Image');
    const emoji = decodeURIComponent(searchParams.get('emoji') || '🎨');
    const bg = searchParams.get('bg') || 'f3f4f6';
    const text = searchParams.get('text') || '374151';

    return new ImageResponse(
      (
        <div
          style={{
            background: `#${bg}`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Inter", "Arial", sans-serif',
            border: '2px solid #e5e7eb',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontSize: Math.min(width, height) * 0.15,
              marginBottom: height * 0.05,
              lineHeight: 1,
            }}
          >
            {emoji}
          </div>
          
          <div
            style={{
              fontSize: Math.min(width, height) * 0.08,
              fontWeight: 'bold',
              color: `#${text}`,
              textAlign: 'center',
              marginBottom: height * 0.03,
              maxWidth: '80%',
              lineHeight: 1.2,
            }}
          >
            {header}
          </div>
          
          <div
            style={{
              fontSize: Math.min(width, height) * 0.04,
              color: `#${text}`,
              textAlign: 'center',
              opacity: 0.8,
              maxWidth: '70%',
              lineHeight: 1.4,
            }}
          >
            {body}
          </div>
        </div>
      ),
      {
        width,
        height,
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      },
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
