# 투자실험실

**숫자로 미리 보는 투자 시나리오**

한국 투자자가 입력한 숫자와 가정만으로 금융·주식·ETF 시나리오를 비교하는 Next.js 기반 교육형 투자 계산기입니다. 외부 금융 API나 서버 데이터베이스를 사용하지 않으며 계산 입력값은 브라우저에서 처리됩니다.

## 포함된 계산기

1. 레버리지 ETF 변동성 손실 계산기
2. 배당성장 ETF 역전 시점 계산기
3. 투자 손실 회복 계산기
4. 포트폴리오 리밸런싱 계산기
5. 목표 자산 역산 계산기
6. 자사주매입 효과 계산기

## 기술 스택

- Next.js App Router
- React / TypeScript
- Tailwind CSS
- shadcn/ui 스타일 공통 컴포넌트
- Recharts
- Lucide Icons
- localStorage
- Vitest

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. 최초 설치 후 생성되는 `package-lock.json`은 동일한 의존성 버전을 유지할 수 있도록 GitHub 저장소에 함께 커밋하세요.

## 빌드 및 테스트

```bash
npm run test
npm run lint
npm run build
```

## 환경 변수

`.env.example`을 `.env.local`로 복사한 뒤 실제 배포 도메인을 설정하세요.

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

이 값은 메타데이터, Open Graph, sitemap.xml, robots.txt와 구조화 데이터의 기준 URL로 사용됩니다. 주소 끝의 `/`는 자동으로 제거됩니다.

## 데이터 처리

- 계산 입력값은 브라우저 localStorage에 저장됩니다.
- 저장값과 URL 조건은 현재 입력 구조에 맞는 항목만 불러옵니다.
- 계산 입력값을 별도 애플리케이션 서버나 데이터베이스에 저장하지 않습니다.
- 호스팅 제공자는 서비스 운영과 보안을 위한 일반적인 접속 로그를 처리할 수 있습니다.

## 계산 로직 구조

모든 주요 계산식은 `lib/calculations` 아래에 순수 함수로 분리되어 있습니다. UI와 테스트가 같은 함수를 사용하므로 차트와 결과 카드 간 계산 불일치를 줄였습니다.

## 주의사항

본 프로젝트의 결과는 사용자가 입력한 가정에 따른 교육용 시뮬레이션이며 실제 투자 결과를 보장하지 않습니다. 실제 세금, 거래비용, 환율, 상품 구조, 추적오차와 시장 상황은 별도로 확인해야 합니다.

## Contact

Public user inquiries are received only by email: `investcalc.help@gmail.com`.
