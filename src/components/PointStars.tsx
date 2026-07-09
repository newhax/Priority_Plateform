import React, { useEffect, useState } from 'react';

export const PointStars: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; opacity: string; animationDelay: string }[]>([]);

  useEffect(() => {
    // Generate static point stars
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: `${Math.random() * 0.7 + 0.3}`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.animationDelay,
            animationDuration: '3s',
          }}
        />
      ))}
    </div>
  );
};
