import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Favicon generated at build time from the official logo (public/logo.svg),
// scaled to fill the tile on a white background.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

function logoDataUri() {
  const svg = readFileSync(join(process.cwd(), 'public', 'logo.svg'), 'utf8');
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: 5,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri()} width={32} height={15} alt="" />
      </div>
    ),
    { ...size }
  );
}
