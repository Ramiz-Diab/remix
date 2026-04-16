import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import './Home.css';

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

function Home() {
  const [remixes, setRemixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [pressedButtons, setPressedButtons] = useState([]);
  const audioRefs = useRef({});
  const visualizerBars = Array.from({ length: 64 });
  const mixerButtons = Array.from({ length: 9 });
  const isRTL = document?.documentElement?.dir === 'rtl' || document?.documentElement?.lang === 'ar';

  const content = isRTL
    ? {
        badge: 'متجر الريمكس العربي',
        title: 'اكتشف أحدث الإيقاعات والريمكسات العربية الحصرية',
        subtitle:
          'استمع إلى المعاينات فورًا، واختر مقطعك المفضل، ثم حمّل ريمكسات عربية بجودة عالية للمحتوى والحفلات.',
        browse: 'تصفح الريمكسات',
        learn: 'اعرف أكثر',
        latest: 'أحدث الريمكسات',
        viewAll: 'عرض الكل',
        catalog: 'المكتبة المباشرة',
        instant: 'معاينة فورية',
        quality: 'جودة احترافية',
        tracks: `${remixes.length} مقطع متاح`,
        updating: 'جاري التحديث...',
        instantDesc: 'استمع قبل الشراء بزر واحد فقط.',
        qualityDesc: 'صوت قوي جاهز للحفلات وصنّاع المحتوى.',
        loading: 'جاري تحميل الريمكسات...',
        empty: 'لا توجد ريمكسات حاليًا. يرجى المحاولة لاحقًا.',
        play: 'تشغيل المعاينة',
        pause: 'إيقاف المعاينة'
      }
    : {
        badge: 'Arabic Remix Store',
        title: 'Discover Fresh Arabic Beats and Exclusive Remixes',
        subtitle:
          'Stream previews instantly, find your next favorite track, and download premium Arabic remix collections made for DJs, creators, and music lovers.',
        browse: 'Browse Remixes',
        learn: 'Learn More',
        latest: 'Latest Remixes',
        viewAll: 'View all',
        catalog: 'Live Catalog',
        instant: 'Instant Preview',
        quality: 'High Quality',
        tracks: `${remixes.length} tracks available`,
        updating: 'Updating...',
        instantDesc: 'Listen before you buy with one-click playback.',
        qualityDesc: 'Professional sound ready for events and content.',
        loading: 'Loading remixes...',
        empty: 'No remixes available yet. Please check back soon.',
        play: 'Play Preview',
        pause: 'Pause Preview'
      };

  useEffect(() => {
    try {
      console.log('Firebase Config loaded:', {
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
      });

      // Read from "remix" collection which contains documents like remix1, remix2
      const remixCollection = collection(db, 'remix');
      
      const unsubscribe = onSnapshot(remixCollection, (snapshot) => {
        console.log('Snapshot received. Number of docs:', snapshot.docs.length);
        console.log('All documents in remix collection:', snapshot.docs.map(d => d.id));
        
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          console.log('Document ID:', doc.id);
          console.log('Document data:', docData);
          return {
            id: doc.id,
            name: docData.name || 'Unknown',
            description: docData.description || '',
            price: docData.price || '0',
            link: docData.link || '#'
          };
        });
        
        console.log('Processed remixes:', data);
        setRemixes(data);
        setLoading(false);
      }, (error) => {
        console.error('Firestore snapshot error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        setLoading(false);
      });

      return () => {
        unsubscribe();
        Object.values(audioRefs.current).forEach((audio) => {
          if (audio && !audio.paused) {
            audio.pause();
          }
        });
      };
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
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

  const toggleMixerButton = (index) => {
    setPressedButtons((prev) =>
      prev.includes(index) ? prev.filter((btnIndex) => btnIndex !== index) : [...prev, index]
    );
  };

  return (
    <div className={`page home-page ${isRTL ? 'home-page-rtl' : ''}`}>
      <section className={`featured-remixes ${playingId ? 'playing' : ''}`} aria-label="Turntable visual">
        <div className="home-remix-console">
          <div className="dj-toy-box">
            <div className="dj-toy-turntable">
              <div className="dj-platter-base">
                <div className="dj-inner">
                  <div className="dj-platter">
                    <div className="dj-inner-ring dj-ring-1">
                      <div className="dj-inner-ring dj-ring-2">
                        <div className="dj-inner-ring dj-ring-3">
                          <div className="dj-inner-ring dj-ring-4">
                            <div className="dj-inner-ring dj-ring-5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dj-mixer">
                <div className="dj-inner">
                  <div className="dj-screen">
                    <div className="dj-bar"></div>
                    <div className="dj-bar"></div>
                    <div className="dj-bar"></div>
                    <div className="dj-bar"></div>
                    <div className="dj-bar"></div>
                  </div>
                  <div className="dj-controls">
                    <div className="dj-buttons">
                      {mixerButtons.map((_, index) => (
                        <div
                          key={`mixer-button-${index}`}
                          className={`dj-button ${pressedButtons.includes(index) ? 'pressed' : ''}`}
                          onClick={() => toggleMixerButton(index)}
                          role="button"
                          aria-label={`Mixer button ${index + 1}`}
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              toggleMixerButton(index);
                            }
                          }}
                        ></div>
                      ))}
                    </div>
                    <input type="range" className="dj-slider" />
                  </div>
                </div>
              </div>

              <div className="dj-platter-base">
                <div className="dj-inner">
                  <div className="dj-platter">
                    <div className="dj-inner-ring dj-ring-1">
                      <div className="dj-inner-ring dj-ring-2">
                        <div className="dj-inner-ring dj-ring-3">
                          <div className="dj-inner-ring dj-ring-4">
                            <div className="dj-inner-ring dj-ring-5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-hero">
        <p className="home-badge">{content.badge}</p>
        <h1>{content.title}</h1>
        <p className="home-subtitle">{content.subtitle}</p>
        <div className="home-hero-actions">
          <Link to="/shop" className="btn btn-primary">
            {content.browse}
          </Link>
          <Link to="/about" className="btn btn-secondary">
            {content.learn}
          </Link>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stat-card">
          <h3>{content.catalog}</h3>
          <p>{loading ? content.updating : content.tracks}</p>
        </div>
        <div className="home-stat-card">
          <h3>{content.instant}</h3>
          <p>{content.instantDesc}</p>
        </div>
        <div className="home-stat-card">
          <h3>{content.quality}</h3>
          <p>{content.qualityDesc}</p>
        </div>
      </section>

      <section className={`featured-remixes ${playingId ? 'playing' : ''}`}>
        <div className="home-section-heading">
          <h2>{content.latest}</h2>
          <Link to="/shop" className="home-view-all">
            {content.viewAll}
          </Link>
        </div>
        <div className={`audio-reactive-strip ${playingId ? 'active' : ''}`} aria-hidden="true">
          {visualizerBars.map((_, index) => (
            <span key={`home-bar-${index}`}></span>
          ))}
        </div>
        {loading ? (
          <p className="home-loading">{content.loading}</p>
        ) : remixes.length === 0 ? (
          <p className="home-loading">{content.empty}</p>
        ) : (
          <div className="remix-grid">
            {remixes.slice(-4).map((remix) => (
              <div 
                className="remix-card" 
                key={remix.id}
                style={{ borderColor: playingId === remix.id ? '#ff4444' : '#ffc107' }}
              >
                <h4>{remix.name}</h4>
                <p className="price">{remix.price} $</p>
                <button 
                  className="btn-play"
                  onClick={() => handlePlayPause(remix.id, remix.link)}
                >
                  {playingId === remix.id ? content.pause : content.play}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
