import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div
      className="rounded-lg px-4 py-4 mb-4"
      style={{
        backgroundColor: '#13131A',
        border: '1px solid #1E1E2E',
      }}
    >
      <p
        className="italic leading-snug mb-2"
        style={{
          color: '#F8F9FA',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
        }}
      >
        &ldquo;{quote.text}&rdquo;
      </p>
      <p
        style={{
          color: '#6C757D',
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        — {quote.author}
      </p>
    </div>
  );
}
