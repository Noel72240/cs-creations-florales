/** Icônes SVG réseaux (monochrome, currentColor) — cercles gérés par le parent */

function IconFacebook({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconInstagram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.011 3.583-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.716-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558 1.28.06 1.687.072 4.947.072s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.32 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
    </svg>
  )
}

/** Tracé Simple Icons (cdn.simpleicons.org) — v4.03 correcte (évite la déformation de v3.89) */
function IconTiktok({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

const circleClass =
  'w-9 h-9 rounded-full bg-mauve/10 flex items-center justify-center hover:bg-mauve hover:text-white transition-all text-mauve shrink-0'
const iconClass = 'w-[1.125rem] h-[1.125rem]'
/** TikTok : glyphe plus dense, légèrement plus grand pour rester lisible */
const iconClassTiktok = 'w-5 h-5'

/**
 * @param {{ facebookUrl?: string, instagramUrl?: string, tiktokUrl?: string, className?: string }} props
 */
export default function SocialIconLinks({ facebookUrl, instagramUrl, tiktokUrl, className = '' }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {facebookUrl ? (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={circleClass}
          aria-label="Facebook — nouvelle fenêtre"
        >
          <IconFacebook className={iconClass} />
        </a>
      ) : null}
      {instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={circleClass}
          aria-label="Instagram — nouvelle fenêtre"
        >
          <IconInstagram className={iconClass} />
        </a>
      ) : null}
      {tiktokUrl ? (
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={circleClass}
          aria-label="TikTok — nouvelle fenêtre"
        >
          <IconTiktok className={iconClassTiktok} />
        </a>
      ) : null}
    </div>
  )
}
