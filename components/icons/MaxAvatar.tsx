import React from 'react';

const MaxAvatar: React.FC = () => (
  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ring-1 ring-white/10 shadow-lg">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#c084fc', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M4 18V6H7L12 13L17 6H20V18H17V9L12 16L7 9V18H4Z"
        fill="url(#avatarGradient)"
        stroke="none"
      />
    </svg>
  </div>
);

export default MaxAvatar;