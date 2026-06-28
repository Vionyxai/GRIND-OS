import { useState } from 'react';
import { Lock, Flame, Zap, Star, Trophy, X, type LucideIcon } from 'lucide-react';
import { Badge } from '../types';
import { BADGE_DEFINITIONS } from '../data/badges';

interface BadgeGridProps {
  earnedBadges: Badge[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Zap,
  Star,
  Trophy,
  Lock,
};

interface BadgeModalProps {
  definition: (typeof BADGE_DEFINITIONS)[number];
  earned: Badge | undefined;
  onClose: () => void;
}

function BadgeModal({ definition, earned, onClose }: BadgeModalProps) {
  const IconComponent = ICON_MAP[definition.icon] ?? Star;
  const isEarned = !!earned;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="w-full rounded-t-2xl p-6"
        style={{ backgroundColor: '#13131A', border: '1px solid #1E1E2E' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: isEarned ? '#FFD16620' : '#1E1E2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent
                size={26}
                color={isEarned ? '#FFD166' : '#6C757D'}
              />
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '22px',
                  color: isEarned ? '#FFD166' : '#6C757D',
                  letterSpacing: '0.05em',
                }}
              >
                {definition.name}
              </p>
              {isEarned && earned && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#06D6A0' }}>
                  Earned {earned.earnedAt}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#6C757D', padding: '4px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#F8F9FA', marginBottom: '8px' }}>
          {definition.description}
        </p>

        {!isEarned && (
          <div
            className="rounded-lg px-3 py-2 mt-3"
            style={{ backgroundColor: '#1E1E2E' }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6C757D' }}>
              HOW TO EARN: {definition.howToEarn}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BadgeGrid({ earnedBadges }: BadgeGridProps) {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const selectedDefinition = BADGE_DEFINITIONS.find((b) => b.id === selectedBadgeId);
  const selectedEarned = earnedBadges.find((b) => b.id === selectedBadgeId);

  return (
    <>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}
      >
        {BADGE_DEFINITIONS.map((def) => {
          const earned = earnedBadges.find((b) => b.id === def.id);
          const isEarned = !!earned;
          const IconComponent = ICON_MAP[def.icon] ?? Star;

          return (
            <button
              key={def.id}
              onClick={() => setSelectedBadgeId(def.id)}
              className="flex flex-col items-center gap-2 rounded-xl p-3"
              style={{
                backgroundColor: '#13131A',
                border: `1px solid ${isEarned ? '#FFD16640' : '#1E1E2E'}`,
                opacity: isEarned ? 1 : 0.5,
                minHeight: '44px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: isEarned ? '#FFD16620' : '#1E1E2E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isEarned ? (
                  <IconComponent size={22} color="#FFD166" />
                ) : (
                  <Lock size={18} color="#6C757D" />
                )}
              </div>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: isEarned ? '#F8F9FA' : '#6C757D',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  lineHeight: '1.2',
                }}
              >
                {def.name}
              </p>
            </button>
          );
        })}
      </div>

      {selectedBadgeId && selectedDefinition && (
        <BadgeModal
          definition={selectedDefinition}
          earned={selectedEarned}
          onClose={() => setSelectedBadgeId(null)}
        />
      )}
    </>
  );
}
