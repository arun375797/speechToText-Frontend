import { useMemo } from "react";

/**
 * Large flowing gradient areas that create ambient lighting
 * Similar to Code Vault's style with large diffused color zones
 */
export default function BulbBackground() {
  const gradients = useMemo(() => [
    {
      id: 'gradient-1',
      position: 'top-left',
      colors: ['#22D3EE', '#06B6D4'], // cyan-400 to cyan-500
      size: '400px',
      blur: '120px',
      animation: 'float-1'
    },
    {
      id: 'gradient-2', 
      position: 'bottom-left',
      colors: ['#10B981', '#059669'], // emerald-500 to emerald-600
      size: '350px',
      blur: '100px',
      animation: 'float-2'
    },
    {
      id: 'gradient-3',
      position: 'top-right', 
      colors: ['#A855F7', '#9333EA'], // purple-500 to purple-600
      size: '380px',
      blur: '110px',
      animation: 'float-3'
    },
    {
      id: 'gradient-4',
      position: 'bottom-right',
      colors: ['#F472B6', '#EC4899'], // pink-400 to pink-500
      size: '320px',
      blur: '90px',
      animation: 'float-4'
    },
    {
      id: 'gradient-5',
      position: 'center',
      colors: ['#6366F1', '#4F46E5'], // indigo-500 to indigo-600
      size: '300px',
      blur: '80px',
      animation: 'float-5'
    }
  ], []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {gradients.map((gradient) => (
        <div
          key={gradient.id}
          className={`gradient-orb gradient-${gradient.position} ${gradient.animation}`}
          style={{
            '--gradient-colors': gradient.colors.join(', '),
            '--orb-size': gradient.size,
            '--blur-amount': gradient.blur,
          }}
        />
      ))}
      {/* Subtle overlay to ensure content readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
