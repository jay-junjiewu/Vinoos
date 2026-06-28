import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Apple touch icon from the official logo (public/logo.svg), scaled to fill a
// full white tile (iOS applies its own rounded mask, so no transparency here).
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

function logoDataUri() {
  const svg = readFileSync(join(process.cwd(), 'public', 'logo.svg'), 'utf8');
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

export default function AppleIcon() {
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoDataUri()} width={172} height={83} alt="" />
      </div>
    ),
    { ...size }
  );
}
