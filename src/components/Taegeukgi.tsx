import React from 'react';

interface TaegeukgiProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  withBorder?: boolean;
}

export const Taegeukgi: React.FC<TaegeukgiProps> = ({
  className = '',
  width = 60,
  height = 40,
  withBorder = true,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      width={width}
      height={height}
      className={`inline-block select-none ${withBorder ? 'shadow-sm rounded-[2px] ring-1 ring-slate-900/10' : ''} ${className}`}
      aria-label="대한민국 국기 태극기"
      role="img"
    >
      <title>대한민국 국기 태극기</title>
      <defs>
        {/* Clip path for the white base */}
        <clipPath id="flag-boundary">
          <rect width="900" height="600" rx="4" />
        </clipPath>

        {/* Trigram bar base unit: width 100, height 12 */}
        <rect id="solid-bar" x="-50" y="-6" width="100" height="12" rx="1.5" fill="#0A0A0A" />
        <g id="broken-bar">
          <rect x="-50" y="-6" width="46" height="12" rx="1.5" fill="#0A0A0A" />
          <rect x="4" y="-6" width="46" height="12" rx="1.5" fill="#0A0A0A" />
        </g>

        {/* 1. Geon (건 ☰): 3 solid bars */}
        <g id="trigram-geon">
          <use href="#solid-bar" y="-22" />
          <use href="#solid-bar" y="0" />
          <use href="#solid-bar" y="22" />
        </g>

        {/* 2. Gon (곤 ☷): 3 broken bars */}
        <g id="trigram-gon">
          <use href="#broken-bar" y="-22" />
          <use href="#broken-bar" y="0" />
          <use href="#broken-bar" y="22" />
        </g>

        {/* 3. Gam (감 ☵): broken, solid, broken */}
        <g id="trigram-gam">
          <use href="#broken-bar" y="-22" />
          <use href="#solid-bar" y="0" />
          <use href="#broken-bar" y="22" />
        </g>

        {/* 4. Ri (리 ☲): solid, broken, solid */}
        <g id="trigram-ri">
          <use href="#solid-bar" y="-22" />
          <use href="#broken-bar" y="0" />
          <use href="#solid-bar" y="22" />
        </g>
      </defs>

      {/* Pure White Background */}
      <rect width="900" height="600" fill="#FFFFFF" clipPath="url(#flag-boundary)" />

      {/* Center Taegeuk (Diameter 300, Radius 150) tilted along diagonal (~33.69 degrees) */}
      <g transform="translate(450, 300) rotate(33.69)">
        {/* Red Yang (Top half) */}
        <path
          d="M -150 0 A 150 150 0 0 1 150 0 A 75 75 0 0 1 0 0 A 75 75 0 0 0 -150 0 Z"
          fill="#CD2E3A"
        />
        {/* Blue Eum (Bottom half) */}
        <path
          d="M 150 0 A 150 150 0 0 1 -150 0 A 75 75 0 0 1 0 0 A 75 75 0 0 0 150 0 Z"
          fill="#0047A0"
        />
      </g>

      {/* 4 Trigrams positioned along the diagonals at distance 240 from center */}
      {/* Diagonal angle is arctan(600/900) = 33.69 deg */}

      {/* Geon (건): Top-Left (180 + 33.69 = 213.69 deg) */}
      <g transform="translate(250, 167) rotate(33.69)">
        <use href="#trigram-geon" />
      </g>

      {/* Gon (곤): Bottom-Right (33.69 deg) */}
      <g transform="translate(650, 433) rotate(33.69)">
        <use href="#trigram-gon" />
      </g>

      {/* Gam (감): Top-Right (360 - 33.69 = -33.69 deg) */}
      <g transform="translate(650, 167) rotate(-33.69)">
        <use href="#trigram-gam" />
      </g>

      {/* Ri (리): Bottom-Left (180 - 33.69 = 146.31 deg) */}
      <g transform="translate(250, 433) rotate(-33.69)">
        <use href="#trigram-ri" />
      </g>
    </svg>
  );
};
