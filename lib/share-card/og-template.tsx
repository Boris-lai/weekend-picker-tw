export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const OG_TEXT = Array.from(
  new Set(
    [
      'AI 微旅行指南 · 台灣',
      '✦ issue 001',
      '週末',
      '去哪裡.',
      '給我一個方向，AI 幫你排一份真的走得完的台灣半日 / 一日小旅行',
      'weekend-picker.app',
      '在台灣這座島上',
    ]
      .join('')
      .split(''),
  ),
).join('');

export function OgCard() {
  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 88px',
        background:
          'linear-gradient(135deg, #0a0e1a 0%, #11162a 55%, #1a2034 100%)',
        color: '#f5f3ef',
        fontFamily: 'Noto Sans TC',
        position: 'relative',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(251,191,36,0.22), transparent 70%)',
          display: 'flex',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 24,
            color: 'rgba(245, 243, 239, 0.55)',
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              display: 'flex',
              width: 10,
              height: 10,
              borderRadius: 999,
              background: '#fbbf24',
              boxShadow: '0 0 20px #fbbf24',
            }}
          />
          AI 微旅行指南 · 台灣
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            border: '2px dashed rgba(251, 191, 36, 0.7)',
            borderRadius: 4,
            color: '#fbbf24',
            fontSize: 22,
            textTransform: 'uppercase',
            letterSpacing: 4,
            transform: 'rotate(-5deg)',
          }}
        >
          ✦ issue 001
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            fontSize: 168,
            lineHeight: 0.95,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#f5f3ef',
          }}
        >
          週末去哪裡
          <span style={{ display: 'flex', color: '#fbbf24', marginLeft: 4 }}>
            .
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            lineHeight: 1.45,
            color: 'rgba(245, 243, 239, 0.75)',
            maxWidth: 880,
          }}
        >
          給我一個方向，AI 幫你排一份真的走得完的台灣半日 / 一日小旅行。
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingTop: 32,
          borderTop: '1px solid rgba(245, 243, 239, 0.12)',
          fontSize: 22,
          color: 'rgba(245, 243, 239, 0.5)',
          letterSpacing: 2,
        }}
      >
        <span style={{ display: 'flex' }}>weekend-picker.app</span>
        <span style={{ display: 'flex' }}>在台灣這座島上</span>
      </div>
    </div>
  );
}
