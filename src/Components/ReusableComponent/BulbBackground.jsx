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
      colors: ['#3B82F6', '#1D4ED8'], // Professional blue gradient
      size: '450px',
      blur: '140px',
      animation: 'float-1'
    },
    {
      id: 'gradient-2', 
      position: 'bottom-left',
      colors: ['#10B981', '#047857'], // Professional emerald gradient
      size: '400px',
      blur: '120px',
      animation: 'float-2'
    },
    {
      id: 'gradient-3',
      position: 'top-right', 
      colors: ['#8B5CF6', '#7C3AED'], // Professional violet gradient
      size: '420px',
      blur: '130px',
      animation: 'float-3'
    },
    {
      id: 'gradient-4',
      position: 'bottom-right',
      colors: ['#06B6D4', '#0891B2'], // Professional cyan gradient
      size: '380px',
      blur: '110px',
      animation: 'float-4'
    },
    {
      id: 'gradient-5',
      position: 'center',
      colors: ['#6366F1', '#4F46E5'], // Professional indigo gradient
      size: '350px',
      blur: '100px',
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
