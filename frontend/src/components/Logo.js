import React from 'react';

/**
 * AutoGuard Logo Component
 * 
 * @param {number} size - Size of the logo (width/height in pixels)
 * @param {string} variant - 'default' | 'light' | 'icon'
 * @param {boolean} showText - Show text below logo
 * @param {string} className - Additional CSS classes
 */
const AutoGuardLogo = ({ 
  size = 40, 
  variant = 'default', 
  showText = false,
  className = '' 
}) => {
  
  const logoVariants = {
    default: (
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#1E293B', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#334155', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:0.3}} />
            <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:0.1}} />
          </linearGradient>
        </defs>
        
        <polygon points="100,5 175,47.5 175,132.5 100,175 25,132.5 25,47.5" 
                 fill="url(#glowGradient)" 
                 opacity="0.5"/>
        
        <polygon points="100,15 165,52.5 165,127.5 100,165 35,127.5 35,52.5" 
                 fill="url(#badgeGradient)" 
                 stroke="#3B82F6" 
                 strokeWidth="3"/>
        
        <g transform="translate(55, 50)">
          <path d="M 10,0 L 0,0 L 0,20 Q 0,30 10,35 Q 20,30 20,20 L 20,0 Z" 
                fill="#10B981" 
                opacity="0.9"/>
          <path d="M 10,5 L 5,5 L 5,20 Q 5,25 10,28 Q 15,25 15,20 L 15,5 Z" 
                fill="#34D399" 
                opacity="0.6"/>
        </g>
        
        <g transform="translate(130, 62)">
          <path d="M 0,-12 L 2,-10 L 2,-8 Q 8,-10 12,0 L 10,2 L 8,2 Q 10,8 0,12 L -2,10 L -2,8 Q -8,10 -12,0 L -10,-2 L -8,-2 Q -10,-8 0,-12 Z" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="2.5"/>
          <circle cx="0" cy="0" r="5" fill="#3B82F6"/>
          <circle cx="0" cy="0" r="3" fill="#1E293B"/>
        </g>
        
        <text x="100" y="115" 
              fontFamily="Arial, sans-serif" 
              fontSize="40" 
              fontWeight="bold" 
              fill="url(#textGradient)" 
              textAnchor="middle">AG</text>
        
        {showText && (
          <>
            <text x="100" y="145" 
                  fontFamily="Arial, sans-serif" 
                  fontSize="16" 
                  fontWeight="600" 
                  fill="#3B82F6" 
                  textAnchor="middle">AutoGuard</text>
            
            <text x="100" y="160" 
                  fontFamily="Arial, sans-serif" 
                  fontSize="8" 
                  fill="#94A3B8" 
                  textAnchor="middle">Infrastructure Guardian</text>
          </>
        )}
      </svg>
    ),
    
    light: (
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="badgeGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#F1F5F9', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#E2E8F0', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="textGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <polygon points="100,15 165,52.5 165,127.5 100,165 35,127.5 35,52.5" 
                 fill="url(#badgeGradientLight)" 
                 stroke="#3B82F6" 
                 strokeWidth="3"/>
        
        <g transform="translate(55, 50)">
          <path d="M 10,0 L 0,0 L 0,20 Q 0,30 10,35 Q 20,30 20,20 L 20,0 Z" 
                fill="#10B981" 
                opacity="0.9"/>
          <path d="M 10,5 L 5,5 L 5,20 Q 5,25 10,28 Q 15,25 15,20 L 15,5 Z" 
                fill="#34D399" 
                opacity="0.6"/>
        </g>
        
        <g transform="translate(130, 62)">
          <path d="M 0,-12 L 2,-10 L 2,-8 Q 8,-10 12,0 L 10,2 L 8,2 Q 10,8 0,12 L -2,10 L -2,8 Q -8,10 -12,0 L -10,-2 L -8,-2 Q -10,-8 0,-12 Z" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="2.5"/>
          <circle cx="0" cy="0" r="5" fill="#3B82F6"/>
          <circle cx="0" cy="0" r="3" fill="#E2E8F0"/>
        </g>
        
        <text x="100" y="115" 
              fontFamily="Arial, sans-serif" 
              fontSize="40" 
              fontWeight="bold" 
              fill="url(#textGradientLight)" 
              textAnchor="middle">AG</text>
        
        {showText && (
          <>
            <text x="100" y="145" 
                  fontFamily="Arial, sans-serif" 
                  fontSize="16" 
                  fontWeight="600" 
                  fill="#3B82F6" 
                  textAnchor="middle">AutoGuard</text>
            
            <text x="100" y="160" 
                  fontFamily="Arial, sans-serif" 
                  fontSize="8" 
                  fill="#64748B" 
                  textAnchor="middle">Infrastructure Guardian</text>
          </>
        )}
      </svg>
    ),
    
    icon: (
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="badgeGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#1E293B', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#334155', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="textGradientIcon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        <polygon points="100,20 160,57.5 160,132.5 100,170 40,132.5 40,57.5" 
                 fill="url(#badgeGradientIcon)" 
                 stroke="#3B82F6" 
                 strokeWidth="4"/>
        
        <g transform="translate(60, 65)">
          <path d="M 10,0 L 0,0 L 0,25 Q 0,35 10,42 Q 20,35 20,25 L 20,0 Z" 
                fill="#10B981" 
                opacity="0.9"/>
          <path d="M 10,5 L 5,5 L 5,25 Q 5,30 10,35 Q 15,30 15,25 L 15,5 Z" 
                fill="#34D399" 
                opacity="0.6"/>
        </g>
        
        <g transform="translate(130, 82)">
          <path d="M 0,-15 L 3,-12 L 3,-10 Q 10,-12 15,0 L 12,3 L 10,3 Q 12,10 0,15 L -3,12 L -3,10 Q -10,12 -15,0 L -12,-3 L -10,-3 Q -12,-10 0,-15 Z" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="3"/>
          <circle cx="0" cy="0" r="6" fill="#3B82F6"/>
          <circle cx="0" cy="0" r="4" fill="#1E293B"/>
        </g>
        
        <text x="100" y="125" 
              fontFamily="Arial, sans-serif" 
              fontSize="48" 
              fontWeight="bold" 
              fill="url(#textGradientIcon)" 
              textAnchor="middle">AG</text>
      </svg>
    )
  };

  return (
    <div className={`autoguard-logo ${className}`} style={{ display: 'inline-block' }}>
      {logoVariants[variant] || logoVariants.default}
    </div>
  );
};

export default AutoGuardLogo;
