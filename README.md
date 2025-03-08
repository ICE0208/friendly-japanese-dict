# I Hate Kanji (한자 검색 도구)

이 프로젝트는 일본어 한자 및 단어를 검색하고 학습할 수 있는 웹 애플리케이션입니다. 다양한 사전 API를 활용하여 한자의 의미, 예문, 관련 단어 등을 제공합니다.

## 주요 기능

- 일본어 한자 및 단어 검색
- 한자의 상세 정보 (음독, 훈독, 부수, 획수 등) 제공
- 예문 및 관련 단어 검색
- 자동 완성 기능
- 다음 사전 및 Jisho API 연동

## 기술 스택

- Next.js 15.2.1
- React 19
- TypeScript
- TailwindCSS
- Cheerio (웹 스크래핑)
- Unofficial Jisho API

## 설치 방법

1. 저장소를 클론합니다:

   ```bash
   git clone https://github.com/yourusername/i-hate-kanji.git
   cd i-hate-kanji
   ```

2. 의존성 패키지를 설치합니다:
   ```bash
   npm install
   ```

## 실행 방법

### 개발 모드로 실행

개발 서버를 시작하려면 다음 명령어를 실행합니다:

```bash
npm run dev
```

이후 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

프로덕션용 빌드를 생성하려면 다음 명령어를 실행합니다:

```bash
npm run build
```

빌드된 애플리케이션을 실행하려면 다음 명령어를 실행합니다:

```bash
npm run start
```

## 프로젝트 구조

```
i-hate-kanji/
├── src/
│   ├── app/
│   │   ├── api/           # API 라우트
│   │   ├── page.tsx       # 메인 페이지
│   │   └── layout.tsx     # 레이아웃 컴포넌트
│   ├── components/        # React 컴포넌트
│   ├── lib/               # 유틸리티 함수
│   ├── types/             # TypeScript 타입 정의
├── public/                # 정적 파일
├── next.config.ts         # Next.js 설정
└── package.json           # 프로젝트 의존성 및 스크립트
```

## 라이센스

MIT
