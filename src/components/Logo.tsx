// src/components/Logo.tsx
export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three circles in inverted triangle formation */}
      <g transform="translate(50, 50)">
        {/* Top circle */}
        <circle cx="0" cy="-18" r="12" fill="currentColor" />
        
        {/* Bottom left circle */}
        <circle cx="-14" cy="9" r="12" fill="currentColor" />
        
        {/* Bottom right circle */}
        <circle cx="14" cy="9" r="12" fill="currentColor" />
      </g>
    </svg>
  );
}