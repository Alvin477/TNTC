'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

let uniqueId = 0;
const getUniqueId = () => `ad-${Date.now()}-${uniqueId++}`;

export default function Home() {
  const [ads, setAds] = useState<{
    id: string;
    position: { x: number; y: number };
    isGif: boolean;
    fileNumber: number;
    size: { width: number; height: number };
  }[]>([]);

  const getRandomNumber = (max: number) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  const getRandomPosition = () => {
    return {
      x: getRandomNumber(typeof window !== 'undefined' ? window.innerWidth - 150 : 800),
      y: getRandomNumber(typeof window !== 'undefined' ? window.innerHeight - 150 : 600)
    };
  };

  const getRandomSize = () => {
    const sizes = [
      { width: 150, height: 150 },
      { width: 200, height: 200 },
      { width: 250, height: 250 },
      { width: 300, height: 300 }
    ];
    return sizes[getRandomNumber(sizes.length)];
  };

  const spawnAd = () => {
    const isGif = Math.random() > 0.4;
    const fileNumber = isGif ? getRandomNumber(4) + 1 : getRandomNumber(14) + 1;
    
    const newAd = {
      id: getUniqueId(),
      position: getRandomPosition(),
      isGif,
      fileNumber,
      size: getRandomSize()
    };

    setAds(prev => [...prev.slice(-20), newAd]);
  };

  useEffect(() => {
    // Initial burst of ads
    for (let i = 0; i < 12; i++) {
      setTimeout(spawnAd, i * 100);
    }

    // Multiple spawn intervals for more chaos
    const spawnIntervals = [
      setInterval(spawnAd, 500),
      setInterval(spawnAd, 800),
      setInterval(spawnAd, 1000),
      setInterval(spawnAd, 1200)
    ];

    // Spawn ads on mouse movement
    const handleMouseMove = () => {
      if (Math.random() > 0.7) spawnAd();
    };

    // Spawn ads on scroll
    const handleScroll = () => {
      if (Math.random() > 0.6) spawnAd();
    };

    // Spawn ads on click
    const handleClick = () => {
      if (Math.random() > 0.5) {
        for (let i = 0; i < 3; i++) {
          setTimeout(spawnAd, i * 100);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);

    return () => {
      spawnIntervals.forEach(clearInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Background Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.mainTitle}>$TNTC</h1>
        <p className={styles.subtitle}>Try Not To Cum</p>
        <p className={styles.description}>The Most Annoying Token On Solana</p>
      </div>

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
              onClick={() => {
                // 75% chance to spawn multiple new ads when closing
                if (Math.random() < 0.75) {
                  for (let i = 0; i < 4; i++) {
                    setTimeout(spawnAd, i * 50);
                  }
                }
                setAds(prev => prev.filter(a => a.id !== ad.id));
              }}
              className={styles.closeButton}
            >
              ×
            </button>
            <Image
              src={`/ads/${ad.isGif ? 'gif' : 'ad'}${ad.fileNumber}.${ad.isGif ? 'gif' : 'png'}`}
              alt="Ad"
              width={ad.size.width}
              height={ad.size.height}
              className={styles.adImage}
              priority
            />
          </div>
        ))}
      </div>
    </main>
  );
} 