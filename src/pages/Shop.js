import React, { useState, useEffect, useRef, useContext } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { CartContext } from '../contexts/CartContext';
import './Shop.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Shop() {
  const [remixes, setRemixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});
  const visualizerBars = Array.from({ length: 64 });
  const { addToCart } = useContext(CartContext);
  const isRTL = document?.documentElement?.dir === 'rtl' || document?.documentElement?.lang === 'ar';

  const content = isRTL
    ? {
        title: 'المتجر',
        subtitle: 'تصفح جميع الريمكسات المتاحة واستمع للمعاينة قبل الشراء.',
        loading: 'جاري تحميل الريمكسات...',
        empty: 'لا توجد ريمكسات متاحة حاليًا.',
        headers: ['#', 'الاسم', 'الوصف', 'السعر', 'المعاينة', 'الإجراء'],
        play: 'تشغيل المعاينة',
        pause: 'إيقاف المعاينة',
        addToCart: 'أضف للسلة'
      }
    : {
        title: 'Shop',
        subtitle: 'Browse all available remixes and preview before purchase.',
        loading: 'Loading remixes...',
        empty: 'No remixes available right now.',
        headers: ['#', 'Name', 'Description', 'Price', 'Preview', 'Action'],
        play: 'Play Preview',
        pause: 'Pause Preview',
        addToCart: 'Add to Cart'
      };

  useEffect(() => {
    try {
      const remixCollection = collection(db, 'remix');
      
      const unsubscribe = onSnapshot(remixCollection, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Unknown',
          description: doc.data().description || '',
          price: doc.data().price || '0',
          link: doc.data().link || '#'
        }));
        
        console.log('Shop remixes loaded:', data);
        setRemixes(data);
        setLoading(false);
      }, (error) => {
        console.error('Firestore error:', error);
        setLoading(false);
      });

      const currentAudioRefs = audioRefs.current;
      return () => {
        unsubscribe();
        Object.values(currentAudioRefs).forEach((audio) => {
          if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
        });
      };
    } catch (error) {
      console.error('Error loading remixes:', error);
      setLoading(false);
    }
  }, []);

  const safePlay = (audio) => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Audio play interrupted or blocked:', error);
      });
    }
  };

  const handlePlayPause = (remixId, audioUrl) => {
    // Stop all other audio
    Object.keys(audioRefs.current).forEach(id => {
      if (id !== remixId && audioRefs.current[id]) {
        audioRefs.current[id].pause();
      }
    });

    // Play/pause current
    if (audioRefs.current[remixId]) {
      if (audioRefs.current[remixId].paused) {
        safePlay(audioRefs.current[remixId]);
        setPlayingId(remixId);
      } else {
        audioRefs.current[remixId].pause();
        setPlayingId(null);
      }
    } else {
      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRefs.current[remixId] = audio;
      safePlay(audio);
      setPlayingId(remixId);
      
      audio.addEventListener('ended', () => setPlayingId(null));
    }
  };

  return (
    <div className={`page shop-page ${isRTL ? 'shop-page-rtl' : ''}`}>
      <section className="shop-hero">
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </section>

      {loading ? (
        <p className="shop-loading">{content.loading}</p>
      ) : remixes.length === 0 ? (
        <p className="shop-loading">{content.empty}</p>
      ) : (
        <div className="table-container">
          <div className={`audio-reactive-strip shop-strip ${playingId ? 'active' : ''}`} aria-hidden="true">
            {visualizerBars.map((_, index) => (
              <span key={`shop-bar-${index}`}></span>
            ))}
          </div>
          <table className="remixes-table">
            <thead>
              <tr>
                <th>{content.headers[0]}</th>
                <th>{content.headers[1]}</th>
                <th>{content.headers[2]}</th>
                <th>{content.headers[3]}</th>
                <th>{content.headers[4]}</th>
                <th>{content.headers[5]}</th>
              </tr>
            </thead>
            <tbody>
              {remixes.map((remix, index) => (
                <tr key={remix.id} style={{ borderColor: playingId === remix.id ? '#ff4444' : 'transparent' }}>
                  <td>{index + 1}</td>
                  <td className="name-cell">{remix.name}</td>
                  <td className="description-cell">{remix.description}</td>
                  <td className="price-cell">{remix.price} $</td>
                  <td className="action-cell">
                    <button 
                      className="btn-play-table"
                      onClick={() => handlePlayPause(remix.id, remix.link)}
                    >
                      {playingId === remix.id ? content.pause : content.play}
                    </button>
                  </td>
                  <td className="buy-cell">
                    <button
                    type="button"
                    className="btn-buy btn-card-buy"
                    onClick={() => {
                      addToCart({
                        id: remix.id,
                        name: remix.name,
                        price: Number(remix.price) || 0,
                      });
                    }}
                  >
                      {content.addToCart}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Shop;
