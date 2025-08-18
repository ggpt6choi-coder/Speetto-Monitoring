import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import React, { useEffect, useState } from 'react';
import ResultCardList from './ResultCardList';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// PWA(홈화면 추가/설치)로 실행 중인지 확인 (iOS, Android 크로스 브라우저)
function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

// 카카오톡 인앱 브라우저 감지 함수
function isKakaoWebView() {
  return /KAKAOTALK/i.test(window.navigator.userAgent);
}

// iOS 감지 및 standalone 모드 감지 함수
function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
function isInStandaloneMode() {
  return 'standalone' in window.navigator && window.navigator.standalone;
}

function App() {
  const [showIOSBanner, setShowIOSBanner] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      {/* 카카오웹뷰에서만 외부 브라우저로 열기 버튼 노출 */}
      {isKakaoWebView() && !isStandaloneMode() && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            background: '#fffbe7',
            padding: '18px 12px 12px 12px',
            boxShadow: '0 -2px 16px 0 #bbb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: '1.04rem',
              marginBottom: 8,
              color: '#d84315',
            }}
          >
            브라우저로 열어 바로가기해서 편하게 사용하세요.
            <br />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('URL이 복사되었습니다!');
              }}
              style={{
                display: 'inline-block',
                marginTop: 8,
                background: '#00c853',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                marginRight: 8,
              }}
            >
              URL 복사
            </button>
          </div>
        </div>
      )}
      <ResultCardList />
      {!isIOS() && showInstallPrompt && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: 'rgba(255,255,255,0.98)',
            padding: '18px 12px 12px 12px',
            boxShadow: '0 -2px 16px 0 #bbb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 8 }}
          >
            앱을 홈 화면에 추가하시겠습니까?
          </div>
          <div>
            <button
              onClick={handleInstall}
              style={{
                background: '#00c853',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '1rem',
                marginRight: 8,
                cursor: 'pointer',
              }}
            >
              추가
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              style={{
                background: '#eee',
                color: '#333',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 500,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
      {/* iOS 홈화면 추가 안내 배너 */}
      {isIOS() &&
        !isInStandaloneMode() &&
        showIOSBanner &&
        !isStandaloneMode() && (
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
              background: 'rgba(255,255,255,0.98)',
              padding: '18px 12px 12px 12px',
              boxShadow: '0 -2px 16px 0 #bbb',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{ fontWeight: 700, fontSize: '1.08rem', marginBottom: 8 }}
            >
              아이폰에서는&nbsp;
              <span style={{ color: '#00c853', fontWeight: 800 }}>
                공유 버튼 → '홈 화면에 추가'
              </span>
              를 선택
              <br />홈 화면에서 어플처럼 사용할 수 있습니다.
            </div>
            <button
              onClick={() => setShowIOSBanner(false)}
              style={{
                background: '#00c853',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '1rem',
                marginTop: 8,
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        )}
    </div>
  );
}

export default App;
