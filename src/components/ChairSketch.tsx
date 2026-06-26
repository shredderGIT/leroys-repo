type Props = {
  variant?: "plus6" | "plus8";
  className?: string;
};

// Hand-drawn style office chair sketch. Two subtle variants distinguish
// the products (Plus 6: low/mid back, Plus 8: high back with headrest).
export function ChairSketch({ variant = "plus6", className }: Props) {
  const isHigh = variant === "plus8";
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Headrest (Plus 8 only) */}
        {isHigh && (
          <>
            <path d="M70 28 Q100 18 130 28 L128 46 Q100 38 72 46 Z" />
            <path d="M98 46 L102 60" />
          </>
        )}

        {/* Backrest */}
        <path
          d={
            isHigh
              ? "M68 60 Q100 50 132 60 L128 110 Q100 102 72 110 Z"
              : "M64 56 Q100 46 136 56 L130 112 Q100 104 70 112 Z"
          }
        />
        {/* Backrest contour lines */}
        <path d={isHigh ? "M78 70 Q100 64 122 70" : "M76 68 Q100 62 124 68"} />
        <path d={isHigh ? "M80 88 Q100 82 120 88" : "M78 88 Q100 82 122 88"} />

        {/* Armrests */}
        <path d="M52 108 L58 112 L58 132 L54 134" />
        <path d="M148 108 L142 112 L142 132 L146 134" />

        {/* Seat */}
        <path d="M58 112 Q100 104 142 112 L138 138 Q100 132 62 138 Z" />
        <path d="M64 124 Q100 118 136 124" />

        {/* Gas lift */}
        <path d="M96 138 L96 162" />
        <path d="M104 138 L104 162" />

        {/* Star base */}
        <path d="M100 164 L60 184" />
        <path d="M100 164 L140 184" />
        <path d="M100 164 L100 188" />
        <path d="M100 164 L72 180" />
        <path d="M100 164 L128 180" />

        {/* Casters */}
        <circle cx="58" cy="186" r="4" />
        <circle cx="142" cy="186" r="4" />
        <circle cx="100" cy="190" r="4" />
        <circle cx="72" cy="182" r="3.2" />
        <circle cx="128" cy="182" r="3.2" />
      </g>
    </svg>
  );
}
