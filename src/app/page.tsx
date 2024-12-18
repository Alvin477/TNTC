'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

let uniqueId = 0;
const getUniqueId = () => `ad-${Date.now()}-${uniqueId++}`;

const getRandomNumber = (max: number) => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
};

// File number ranges
const FILE_RANGES = {
  jpg: { start: 15, end: 37 },
  png: { start: 1, end: 14 },
  gif: { start: 1, end: 4 }
};

const getValidFileNumber = (type: 'gif' | 'png' | 'jpg'): number => {
  const range = FILE_RANGES[type];
  return getRandomNumber(range.end - range.start + 1) + range.start;
};

export default function Home() {
  const [ads, setAds] = useState<{
    id: string;
    position: { x: number; y: number };
    type: 'gif' | 'png' | 'jpg';
    fileNumber: number;
    size: { width: number; height: number };
  }[]>([]);

  const getRandomPosition = () => {
    return {
      x: getRandomNumber(typeof window !== 'undefined' ? window.innerWidth - 100 : 800),
      y: getRandomNumber(typeof window !== 'undefined' ? window.innerHeight - 100 : 600)
    };
  };

  const getRandomSize = () => {
    const sizes = [
      { width: 50, height: 50 },     // Tiny ads
      { width: 70, height: 70 },     // Small ads
      { width: 150, height: 150 },   // Medium ads
      { width: 500, height: 500 }    // Large ads
    ];
    return sizes[getRandomNumber(sizes.length)];
  };

  const getRandomImageType = (): 'gif' | 'png' | 'jpg' => {
    const rand = Math.random();
    if (rand < 0.6) return 'gif';  // 60% GIFs for maximum annoyance
    if (rand < 0.8) return 'png';
    return 'jpg';
  };

  const spawnAd = useCallback(() => {
    const type = getRandomImageType();
    const fileNumber = getValidFileNumber(type);
    
    const newAd = {
      id: getUniqueId(),
      position: getRandomPosition(),
      type,
      fileNumber,
      size: getRandomSize()
    };

    setAds(prev => [...prev.slice(-100), newAd]); // Allow up to 100 ads
  }, []);

  const spawnMultiple = useCallback((count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(spawnAd, i * 10); // Super fast spawning
    }
  }, [spawnAd]);

  useEffect(() => {
    // Initial burst of ads
    spawnMultiple(50); // Start with 50 ads

    // Multiple spawn intervals for absolute chaos
    const spawnIntervals = [
      setInterval(() => spawnMultiple(3), 100),  // Spawn 3 ads every 100ms
      setInterval(() => spawnMultiple(2), 150),  // Spawn 2 ads every 150ms
      setInterval(() => spawnMultiple(2), 200),  // Spawn 2 ads every 200ms
      setInterval(() => spawnMultiple(3), 250),  // Spawn 3 ads every 250ms
      setInterval(() => spawnMultiple(2), 300),  // Spawn 2 ads every 300ms
    ];

    // Spawn ads on scroll
    const handleScroll = () => {
      spawnMultiple(10); // 10 ads on scroll
    };

    // Spawn ads on click
    const handleClick = () => {
      spawnMultiple(15); // 15 ads on click
    };

    // Spawn ads on mouse movement
    const handleMouseMove = () => {
      if (Math.random() > 0.5) { // 50% chance
        spawnMultiple(3); // 3 ads on mouse move
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);

    // Additional random bursts
    const burstInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        spawnMultiple(Math.floor(Math.random() * 10) + 5); // 5-15 ads randomly
      }
    }, 1000);

    return () => {
      spawnIntervals.forEach(clearInterval);
      clearInterval(burstInterval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [spawnMultiple]);

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Pop-up Ads Layer */}
      <div className={styles.adLayer}>
        {ads.map((ad, index) => (
          <div
            key={ad.id}
            className={styles.adContainer}
            style={{
              left: `${ad.position.x}px`,
              top: `${ad.position.y}px`,
              width: `${ad.size.width}px`,
              height: `${ad.size.height}px`,
              zIndex: 1000 + index,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                // 98% chance to spawn multiple new ads when closing
                if (Math.random() < 0.98) {
                  spawnMultiple(Math.floor(Math.random() * 10) + 10); // 10-20 new ads
                }
                setAds(prev => prev.filter(a => a.id !== ad.id));
              }}
              className={styles.closeButton}
              onMouseEnter={(e) => {
                // 70% chance to move button when hovering
                if (Math.random() < 0.7) {
                  const btn = e.target as HTMLButtonElement;
                  btn.style.transform = `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px)`;
                }
              }}
            >
              ×
            </button>
            <Image
              src={ad.type === 'gif' 
                ? `/ads/gif${ad.fileNumber}.gif`
                : `/ads/ad${ad.fileNumber}.${ad.type}`}
              alt="Ad"
              width={ad.size.width}
              height={ad.size.height}
              className={styles.adImage}
              priority
            />
          </div>
        ))}
      </div>

      {/* Background Content - Now behind ads */}
      <div className={styles.mainContent}>
        <h1 className={styles.mainTitle}>$TNTC</h1>
        <p className={styles.subtitle}>Try Not To Cum</p>
        <p className={styles.description}>The Most Annoying Token On Solana</p>
      </div>
    </main>
  );
} 