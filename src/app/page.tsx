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
  }[]>([]);

  const getRandomNumber = (max: number) => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  };

  const getRandomPosition = () => ({
    x: getRandomNumber(typeof window !== 'undefined' ? window.innerWidth - 300 : 800),
    y: getRandomNumber(typeof window !== 'undefined' ? window.innerHeight - 300 : 600)
  });

  const spawnAd = () => {
    const isGif = getRandomNumber(2) === 1;
    const fileNumber = isGif ? getRandomNumber(4) + 1 : getRandomNumber(11) + 1;
    
    const newAd = {
      id: getUniqueId(),
      position: getRandomPosition(),
      isGif,
      fileNumber
    };

    setAds(prev => [...prev.slice(-12), newAd]); // Allow up to 12 ads
  };

  useEffect(() => {
    // Initial spawn of 5 ads
    for (let i = 0; i < 5; i++) {
      setTimeout(spawnAd, i * 200);
    }

    // Regular spawn intervals
    const spawnIntervals = [
      setInterval(spawnAd, 1000), // Every 1 second
      setInterval(spawnAd, 1500)  // Every 1.5 seconds
    ];

    return () => {
      spawnIntervals.forEach(clearInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Background Content */}
      <div className={styles.mainContent}>
        <h1 className={styles.mainTitle}>$TNTC</h1>
        <p className={styles.subtitle}>Try Not To Cum</p>
        <p className={styles.description}>The Most Annoying Token in Crypto</p>
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
              zIndex: 1000 + index,
            }}
          >
            <button
              onClick={() => {
                // 50% chance to spawn two new ads when closing
                if (Math.random() < 0.5) {
                  for (let i = 0; i < 2; i++) {
                    setTimeout(spawnAd, i * 100);
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
              width={300}
              height={300}
              className={styles.adImage}
              priority
            />
          </div>
        ))}
      </div>
    </main>
  );
} 