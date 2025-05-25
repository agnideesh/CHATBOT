import { NextResponse } from 'next/server';

// Base64 encoded simple SVG circle that can be used as a placeholder avatar
const placeholderSvg = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="#4F46E5" stroke-width="2" fill="#818CF8" />
  <text x="50" y="55" font-family="Arial" font-size="20" text-anchor="middle" fill="white">AI</text>
</svg>
`;

const svgBase64 = Buffer.from(placeholderSvg).toString('base64');

export async function GET() {
  return new Response(Buffer.from(svgBase64, 'base64'), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 