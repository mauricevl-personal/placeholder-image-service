import { ImageResponse } from '@vercel/og';

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract parameters with defaults and validation
    const width = Math.min(Math.max(parseInt(searchParams.get('width')) || 400, 100), 1200);
    const height = Math.min(Math.max(parseInt(searchParams.get('height')) || 300, 100), 1200);
    const header = searchParams.get('header') || 'Placeholder';
    const body = searchParams.get('body') || 'Image';
    const emoji = searchParams.get('emoji') || '🎨';
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
            fontFamily: 'system-ui, sans-serif',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: Math.min(width, height) * 0.15,
              marginBottom: '10px',
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
              marginBottom: '10px',
              maxWidth: '80%',
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
            }}
          >
            {body}
          </div>
        </div>
      ),
      {
        width,
        height,
      },
    );
  } catch (error) {
    // Return a simple error response
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image', 
        message: error.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
