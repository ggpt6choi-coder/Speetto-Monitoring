# Speetto Monitoring

스피또(즉석복권) 실시간 잭팟/입고율 모니터링 및 모바일 PWA 서비스

## 주요 기능

- Playwright 기반 웹 크롤러로 스피또 복권 데이터(result.json) 자동 수집
- GitHub Actions로 매일/매주 자동 크롤링 및 데이터 커밋
- React 기반 모바일 웹(PWA) 서비스 제공
- Firebase Hosting을 통한 배포 및 접속자 분석(GA 연동)
- 홈화면 추가(PWA), iOS/Android/카카오웹뷰 환경별 안내 지원

## 폴더 구조

```
Speetto/
├── playwright-mcp-example.js   # Playwright 크롤러 예제
├── result.json                 # 크롤링된 복권 데이터
├── .github/workflows/          # GitHub Actions 워크플로우
├── speetto-mobile/             # React(PWA) 프론트엔드
│   ├── src/components/         # 주요 컴포넌트(App.js 등)
│   ├── public/                 # manifest, index.html 등
│   ├── .env                    # (로컬) Firebase 등 환경변수
│   └── ...
└── ...
```

## 사용 기술

- Node.js, Playwright (크롤링)
- React, MUI, PWA (프론트)
- Firebase Hosting, Analytics
- GitHub Actions (자동화)

## 개발/배포 방법

### 1. 크롤러 실행

```sh
node crawling-info.js
```

### 2. 프론트엔드 개발

```sh
cd speetto-mobile
npm install
npm start
```

### 3. 배포(Firebase Hosting)

```sh
npm run build
firebase deploy --only hosting
```

### 4. GitHub Actions 자동화

- `.github/workflows/playwright.yml`에서 스케줄/자동 커밋 설정

## 환경변수(.env 예시)

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

## 참고/특이사항

- `.env` 등 민감 정보는 Git에 올리지 마세요.
- PWA 설치/홈화면 추가, iOS/Android/카카오웹뷰 환경별 안내 지원
- result.json은 자동 커밋/배포됩니다.

---
