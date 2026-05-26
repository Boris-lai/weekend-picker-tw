import type { TripPlan } from '@/lib/validators/trip-plan';

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

export function ShareCard({ plan }: { plan: TripPlan }) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        padding: 80,
        background:
          'linear-gradient(160deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
        color: '#f8fafc',
        fontFamily: 'Noto Sans TC',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: 32,
          opacity: 0.7,
          letterSpacing: 6,
        }}
      >
        週末去哪裡
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 80,
          gap: 28,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.15 }}>
          {plan.title}
        </div>
        <div style={{ fontSize: 36, opacity: 0.75, lineHeight: 1.4 }}>
          {plan.summary}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {plan.targetAudience.map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                fontSize: 28,
                padding: '8px 22px',
                borderRadius: 999,
                background: 'rgba(248, 250, 252, 0.12)',
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 80,
          gap: 28,
          flex: 1,
        }}
      >
        {plan.stops.map((stop, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 32,
              fontSize: 36,
            }}
          >
            <div
              style={{
                display: 'flex',
                color: '#fbbf24',
                fontWeight: 700,
                minWidth: 170,
              }}
            >
              {stop.startTime}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', fontWeight: 700 }}>
                {stop.placeName}
              </div>
              <div style={{ display: 'flex', fontSize: 26, opacity: 0.6 }}>
                {stop.city}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 60,
          paddingTop: 40,
          borderTop: '2px solid rgba(248, 250, 252, 0.2)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', fontSize: 26, opacity: 0.6 }}>
            預估總花費
          </div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700 }}>
            NT$ {plan.estimatedCost.toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, opacity: 0.5 }}>
          weekend-picker.app
        </div>
      </div>
    </div>
  );
}

export function extractCardText(plan: TripPlan): string {
  const parts = [
    '週末去哪裡',
    '預估總花費',
    'NT$',
    'weekend-picker.app',
    plan.title,
    plan.summary,
    plan.estimatedCost.toLocaleString(),
    ...plan.targetAudience.map((t) => `#${t}`),
    ...plan.stops.flatMap((s) => [s.startTime, s.placeName, s.city]),
  ];
  return Array.from(new Set(parts.join('').split(''))).join('');
}
