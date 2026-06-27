import { ImageResponse } from 'next/og';

export const alt =
  'Vinoos Trading EST. — Custom Fish Tanks & Aquariums in the UAE';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#293462',
          color: '#ffffff',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
          Vinoos Trading EST.
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 28,
            color: '#A6D1E6',
            maxWidth: 900,
          }}
        >
          Custom fish tanks, aquariums, acrylic &amp; cabinets — built in the UAE
          since 1997.
        </div>
        <div style={{ display: 'flex', marginTop: 56 }}>
          <div
            style={{
              display: 'flex',
              background: '#FF7F50',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 600,
              padding: '14px 32px',
              borderRadius: 9999,
            }}
          >
            vinoostrading.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
