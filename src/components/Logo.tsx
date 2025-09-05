"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient
            id="sparkleGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main circle background */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#logoGradient)"
          filter="url(#glow)"
        />

        {/* Inner circle for depth */}
        <circle cx="50" cy="50" r="38" fill="rgba(255, 255, 255, 0.1)" />

        {/* Cute AI brain/circuit pattern */}
        <g stroke="white" strokeWidth="2" fill="none" opacity="0.9">
          {/* Central node */}
          <circle cx="50" cy="50" r="6" fill="white" />

          {/* Neural network connections */}
          <path d="M35 35 L50 44" strokeWidth="1.5" />
          <path d="M65 35 L50 44" strokeWidth="1.5" />
          <path d="M35 65 L50 56" strokeWidth="1.5" />
          <path d="M65 65 L50 56" strokeWidth="1.5" />
          <path d="M25 50 L44 50" strokeWidth="1.5" />
          <path d="M75 50 L56 50" strokeWidth="1.5" />

          {/* Outer nodes */}
          <circle cx="35" cy="35" r="3" fill="white" />
          <circle cx="65" cy="35" r="3" fill="white" />
          <circle cx="35" cy="65" r="3" fill="white" />
          <circle cx="65" cy="65" r="3" fill="white" />
          <circle cx="25" cy="50" r="3" fill="white" />
          <circle cx="75" cy="50" r="3" fill="white" />
        </g>

        {/* Cute sparkles */}
        <g fill="url(#sparkleGradient)">
          {/* Top right sparkle */}
          <path
            d="M75 25 L77 20 L79 25 L84 23 L79 25 L77 30 L75 25 L70 27 Z"
            opacity="0.8"
          />

          {/* Bottom left sparkle */}
          <path
            d="M25 75 L27 70 L29 75 L34 73 L29 75 L27 80 L25 75 L20 77 Z"
            opacity="0.6"
          />

          {/* Small sparkle top left */}
          <circle cx="20" cy="20" r="1.5" opacity="0.7" />
          <path
            d="M20 17 L20 23 M17 20 L23 20"
            stroke="url(#sparkleGradient)"
            strokeWidth="1"
            opacity="0.7"
          />

          {/* Small sparkle bottom right */}
          <circle cx="80" cy="80" r="1.5" opacity="0.5" />
          <path
            d="M80 77 L80 83 M77 80 L83 80"
            stroke="url(#sparkleGradient)"
            strokeWidth="1"
            opacity="0.5"
          />
        </g>

        {/* Cute highlight for 3D effect */}
        <ellipse
          cx="42"
          cy="35"
          rx="8"
          ry="6"
          fill="rgba(255, 255, 255, 0.3)"
          transform="rotate(-20 42 35)"
        />
      </svg>
    </div>
  );
}

// Alternative cute mascot-style logo
export function MascotLogo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id="mascotGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <radialGradient id="eyeGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </radialGradient>
        </defs>

        {/* Main body */}
        <ellipse cx="50" cy="55" rx="35" ry="40" fill="url(#mascotGradient)" />

        {/* Cute ears */}
        <ellipse
          cx="35"
          cy="25"
          rx="8"
          ry="15"
          fill="url(#mascotGradient)"
          transform="rotate(-20 35 25)"
        />
        <ellipse
          cx="65"
          cy="25"
          rx="8"
          ry="15"
          fill="url(#mascotGradient)"
          transform="rotate(20 65 25)"
        />

        {/* Inner ears */}
        <ellipse
          cx="35"
          cy="25"
          rx="4"
          ry="8"
          fill="rgba(255, 255, 255, 0.3)"
          transform="rotate(-20 35 25)"
        />
        <ellipse
          cx="65"
          cy="25"
          rx="4"
          ry="8"
          fill="rgba(255, 255, 255, 0.3)"
          transform="rotate(20 65 25)"
        />

        {/* Eyes */}
        <ellipse cx="40" cy="45" rx="6" ry="8" fill="url(#eyeGradient)" />
        <ellipse cx="60" cy="45" rx="6" ry="8" fill="url(#eyeGradient)" />

        {/* Eye pupils */}
        <circle cx="41" cy="47" r="3" fill="#1f2937" />
        <circle cx="61" cy="47" r="3" fill="#1f2937" />

        {/* Eye highlights */}
        <circle cx="42" cy="45" r="1" fill="white" />
        <circle cx="62" cy="45" r="1" fill="white" />

        {/* Cute smile */}
        <path
          d="M42 60 Q50 68 58 60"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cheek blush */}
        <ellipse
          cx="28"
          cy="55"
          rx="4"
          ry="3"
          fill="rgba(255, 182, 193, 0.6)"
        />
        <ellipse
          cx="72"
          cy="55"
          rx="4"
          ry="3"
          fill="rgba(255, 182, 193, 0.6)"
        />

        {/* Data/AI elements floating around */}
        <g fill="rgba(255, 255, 255, 0.7)" fontSize="8" fontFamily="monospace">
          <text x="15" y="70" transform="rotate(-15 15 70)">
            01
          </text>
          <text x="80" y="35" transform="rotate(15 80 35)">
            AI
          </text>
          <text x="85" y="75" transform="rotate(-10 85 75)">
            10
          </text>
        </g>

        {/* Floating sparkles */}
        <g fill="#fbbf24" opacity="0.8">
          <circle cx="20" cy="30" r="1" />
          <circle cx="85" cy="50" r="1.5" />
          <circle cx="25" cy="80" r="1" />
          <path d="M78 20 L79 18 L80 20 L82 19 L80 20 L79 22 L78 20 L76 21 Z" />
        </g>
      </svg>
    </div>
  );
}
