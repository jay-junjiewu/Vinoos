import { ImageResponse } from 'next/og';

// Favicon generated at build time — no binary asset needed.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

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
          background: '#293462',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        V
      </div>
    ),
    { ...size }
  );
}
