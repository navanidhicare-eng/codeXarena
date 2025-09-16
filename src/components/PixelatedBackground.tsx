"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const layers = [
  { src: 'https://picsum.photos/seed/sky/1920/1080', speed: 0.1, zIndex: 0 },
  { src: 'https://picsum.photos/seed/far-mountains/1920/1080', speed: 0.2, zIndex: 1, dataAiHint: "pixel art mountains" },
  { src: 'https://picsum.photos/seed/mountains/1920/1080', speed: 0.3, zIndex: 2, dataAiHint: "pixel art mountains" },
  { src: 'https://picsum.photos/seed/trees/1920/1080', speed: 0.5, zIndex: 3, dataAiHint: "pixel art trees" },
  { src: 'https://picsum.photos/seed/foreground/1920/1080', speed: 1, zIndex: 4, dataAiHint: "pixel art ground" },
];

export function PixelatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {layers.map((layer, index) => {
        const x = (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * layer.speed * 0.05;
        const y = (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * layer.speed * 0.05;

        return (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            style={{ 
                zIndex: layer.zIndex,
                translateX: x,
                translateY: y,
             }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <Image
              src={layer.src}
              alt={`Pixel art background layer ${index + 1}`}
              fill
              quality={80}
              priority={index < 3}
              className="object-cover"
              data-ai-hint={layer.dataAiHint}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
