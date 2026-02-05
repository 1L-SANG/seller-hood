# Sellerhood Functional Flow & Implementation Checklist

**작성일**: 2026-02-05  
**버전**: 1.0  
**관점**: 데이터 바인딩 중심 구현 로드맵  
**참조**: roadmap.md (Phase 1-12 체크리스트)

---

## 📐 문서 목적

본 문서는 **데이터 흐름(Data Flow)** 관점에서 Sellerhood MVP를 구현하기 위한 실행 가능한 체크리스트입니다.

### roadmap.md vs functional_flow.md

| 구분 | roadmap.md | functional_flow.md (본 문서) |
|------|-----------|---------------------------|
| 관점 | "무엇을 해야 하는가" (What) | "데이터가 어떻게 흐르는가" (How) |
| 구조 | Phase 1-12 시간순 | Foundation → Core Logic → Interaction |
| 초점 | 기능 구현 체크리스트 | 데이터 소스 → 처리 → UI 바인딩 |
| 항목 수 | 231개 세부 체크리스트 | 데이터 흐름 중심 68개 그룹 |

---

## 🎯 구현 우선순위

```
🔴 Critical (Must Have) - 주 1-2주차
  └─ MVP 핵심 기능, 없으면 서비스 불가능

🟠 High Priority (Should Have) - 주 2-3주차
  └─ UX 개선, 에러 핸들링, 안정성

🟢 Nice to Have (Could Have) - 주 3-4주차
  └─ 성능 최적화, 모니터링, 고급 기능
```

---

## 📊 기술 스택 요약

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **State Management**: React useState, sessionStorage
- **Data Fetching**: native fetch, React Query (Phase 11)

### Backend
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage (3 buckets)
- **API**: Next.js API Routes (App Router)
- **Security**: Row Level Security (RLS)

### AI Integration
- **이미지 분석**: OpenAI GPT-4 Vision / Anthropic Claude 3.5
- **이미지 생성**: DALL-E 3 / Stable Diffusion / Midjourney API

### DevOps
- **Hosting**: Vercel
- **Monitoring**: Sentry (에러), Vercel Analytics (성능)
- **Package Manager**: pnpm

---

# 🏗️ Phase 1: Foundation (기반 구축)

**우선순위**: 🔴 Critical  
**목표**: Supabase 연동 및 인증 시스템 구축  
**기간**: Day 1-2

---

## 1.1 Supabase 클라이언트 설정

### 데이터 흐름
```
환경변수 (.env.local)
  → Supabase Client 초기화
    → Server/Client Component에서 사용
      → DB/Storage/Auth 접근
```

### 1.1.1 클라이언트 사이드 설정
**파일**: `lib/supabase/client.ts`

```typescript
// 데이터 소스: NEXT_PUBLIC_SUPABASE_* 환경변수
// 처리 로직: createBrowserClient()
// UI 바인딩: Client Components에서 import
```

**태스크**:
- [ ] 1.1.1.1 `@supabase/supabase-js` 패키지 설치 (pnpm add)
- [ ] 1.1.1.2 `createBrowserClient()` 함수 구현
- [ ] 1.1.1.3 환경변수 로드 검증
- [ ] 1.1.1.4 타입 안전성 확보 (`Database` 타입 import)

**검증**:
```typescript
// app/test/page.tsx (테스트용)
const supabase = createClient();
const { data } = await supabase.from('users').select('count');
console.log(data); // [{count: N}]
```

---

### 1.1.2 서버 사이드 설정
**파일**: `lib/supabase/server.ts`

```typescript
// 데이터 소스: cookies() from next/headers
// 처리 로직: createServerClient() with cookie handler
// UI 바인딩: Server Components, API Routes에서 사용
```

**태스크**:
- [ ] 1.1.2.1 `@supabase/ssr` 패키지 설치
- [ ] 1.1.2.2 `createServerClient()` 함수 구현 (쿠키 핸들러 포함)
- [ ] 1.1.2.3 `getCurrentUser()` 헬퍼 함수 구현
- [ ] 1.1.2.4 서버 컴포넌트에서 사용자 정보 가져오기 테스트

**검증**:
```typescript
// app/dashboard/page.tsx (Server Component)
const user = await getCurrentUser();
console.log(user?.email); // user@example.com
```

---

### 1.1.3 미들웨어 설정
**파일**: `middleware.ts`

```typescript
// 데이터 소스: Request cookies
// 처리 로직: 세션 검증 → 보호된 경로 체크
// UI 바인딩: 자동 리다이렉트 (NextResponse)
```

**태스크**:
- [ ] 1.1.3.1 미들웨어 파일 생성
- [ ] 1.1.3.2 보호된 경로 배열 정의 (`/create/*`, `/dashboard`)
- [ ] 1.1.3.3 세션 검증 로직 구현
- [ ] 1.1.3.4 미인증 시 `/login` 리다이렉트
- [ ] 1.1.3.5 DEV 환경 예외 처리 (localStorage 체크)

**검증**:
1. 로그아웃 상태에서 `/create/step1` 접속
2. `/login`으로 리다이렉트 확인

---

## 1.2 Supabase DB 스키마 적용

### 데이터 흐름
```
schema.sql
  → Supabase SQL Editor
    → DB 테이블 생성
      → RLS 정책 적용
        → 앱에서 안전하게 접근
```

### 1.2.1 테이블 생성
**파일**: `supabase/schema.sql`

**태스크**:
- [ ] 1.2.1.1 Supabase Dashboard > SQL Editor 접속
- [ ] 1.2.1.2 `schema.sql` 전체 실행
- [ ] 1.2.1.3 7개 테이블 생성 확인
  - [ ] users
  - [ ] reference_images
  - [ ] reference_style_features
  - [ ] product_images
  - [ ] generations
- [ ] 1.2.1.4 6개 ENUM 타입 생성 확인
  - [ ] plan_type
  - [ ] generation_status
  - [ ] camera_distance_type
  - [ ] camera_angle_type
  - [ ] tone_level_type
  - [ ] background_type

**검증**:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
-- 결과: 7개 테이블
```

---

### 1.2.2 RLS 정책 적용
**파일**: `supabase/rls_policies.sql`

**태스크**:
- [ ] 1.2.2.1 `rls_policies.sql` 실행
- [ ] 1.2.2.2 모든 테이블 RLS 활성화 확인
- [ ] 1.2.2.3 `check_user_credits()` 함수 생성 확인
- [ ] 1.2.2.4 `use_user_credit()` 함수 생성 확인
- [ ] 1.2.2.5 크레딧 트리거 생성 확인

**검증**:
```sql
-- RLS 활성화 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- rowsecurity: true
```

---

### 1.2.3 Storage 버킷 생성
**파일**: `supabase/storage_setup.sql`

**태스크**:
- [ ] 1.2.3.1 `storage_setup.sql` 실행
- [ ] 1.2.3.2 `reference-images` 버킷 생성 (private, 10MB)
- [ ] 1.2.3.3 `product-images` 버킷 생성 (private, 10MB)
- [ ] 1.2.3.4 `generated-images` 버킷 생성 (public, 20MB)
- [ ] 1.2.3.5 각 버킷 RLS 정책 적용 확인

**검증**:
Supabase Dashboard > Storage에서 3개 버킷 확인

---

## 1.3 TypeScript 타입 시스템

### 데이터 흐름
```
Supabase DB Schema
  → TypeScript Interfaces
    → 앱 전역에서 타입 안전성 보장
      → 컴파일 타임 에러 감지
```

### 1.3.1 Database 타입 정의
**파일**: `types/database.ts`

```typescript
// 데이터 소스: Supabase DB 스키마
// 처리 로직: TypeScript interface 정의
// UI 바인딩: 모든 컴포넌트/API에서 import
```

**태스크**:
- [ ] 1.3.1.1 파일 생성
- [ ] 1.3.1.2 ENUM 타입 정의 (6개)
- [ ] 1.3.1.3 테이블 인터페이스 정의 (7개)
  - [ ] User
  - [ ] ReferenceImage
  - [ ] ReferenceStyleFeature
  - [ ] ProductImage
  - [ ] Generation
- [ ] 1.3.1.4 Database 전역 타입 export

**검증**:
```bash
pnpm tsc --noEmit
# 에러 0개
```

---

### 1.3.2 UI 컴포넌트 타입
**파일**: `types/index.ts`

**태스크**:
- [ ] 1.3.2.1 파일 생성
- [ ] 1.3.2.2 Props 인터페이스 정의
- [ ] 1.3.2.3 State 타입 정의
- [ ] 1.3.2.4 API 응답 타입 정의

---

## 1.4 인증 시스템 구현

### 데이터 흐름
```
사용자 입력 (email, password)
  → supabase.auth.signUp/signIn
    → Supabase Auth (JWT 생성)
      → 세션 쿠키 저장
        → middleware.ts 검증
          → 보호된 페이지 접근 허용
```

### 1.4.1 회원가입 플로우
**파일**: `app/(auth)/signup/page.tsx`

```typescript
// 데이터 소스: 폼 입력 (name, email, password)
// 처리 로직: supabase.auth.signUp()
// UI 바인딩: 로딩 상태, 에러 메시지, 리다이렉트
```

**태스크**:
- [ ] 1.4.1.1 useState로 폼 상태 관리 (name, email, password)
- [ ] 1.4.1.2 폼 검증 로직 구현
  - [ ] 이름 2자 이상
  - [ ] 이메일 정규식 검증
  - [ ] 비밀번호 8자 이상
- [ ] 1.4.1.3 `handleSubmit` 함수 구현
  - [ ] `supabase.auth.signUp()` 호출
  - [ ] users 테이블 INSERT (trigger 또는 직접)
  - [ ] 성공 시 `/create/step1` 리다이렉트
  - [ ] 실패 시 에러 토스트 표시
- [ ] 1.4.1.4 로딩 상태 UI 추가

**데이터 바인딩**:
```typescript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Input → State
<Input value={email} onChange={(e) => setEmail(e.target.value)} />

// State → Supabase
const { data, error } = await supabase.auth.signUp({ email, password });

// Response → UI
if (error) setError(error.message);
else router.push('/create/step1');
```

**검증**:
1. `/signup` 접속
2. 정보 입력 후 가입
3. Supabase > Authentication > Users 확인
4. public.users 테이블 레코드 확인
5. `/create/step1` 리다이렉트 확인

---

### 1.4.2 로그인 플로우
**파일**: `app/(auth)/login/page.tsx`

```typescript
// 데이터 소스: 폼 입력 (email, password)
// 처리 로직: supabase.auth.signInWithPassword()
// UI 바인딩: 로딩 상태, 에러 메시지, 리다이렉트
```

**태스크**:
- [ ] 1.4.2.1 useState로 폼 상태 관리
- [ ] 1.4.2.2 `handleSubmit` 함수 구현
  - [ ] `supabase.auth.signInWithPassword()` 호출
  - [ ] 성공 시 `/create/step1` 리다이렉트
  - [ ] 실패 시 에러 메시지 표시
- [ ] 1.4.2.3 DEV 로그인 버튼 유지 (기존 로직)

**검증**:
1. `/login` 접속
2. 가입한 계정으로 로그인
3. 쿠키에 세션 저장 확인
4. `/create/step1` 접근 확인

---

# 🎨 Phase 2: Core Logic (핵심 플로우)

**우선순위**: 🔴 Critical  
**목표**: Step 1-4 데이터 플로우 구현  
**기간**: Day 3-6

---

## 2.1 Step 1: 레퍼런스 업로드 & 분석

### 전체 데이터 흐름
```
사용자: 이미지 선택
  ↓
Client: File → FormData
  ↓
Storage: Supabase Storage 업로드
  ↓
DB: reference_images INSERT
  ↓
API: /api/analyze-reference 호출
  ↓
AI: GPT-4V 이미지 분석
  ↓
DB: reference_style_features INSERT
  ↓
SessionStorage: reference_image_id 저장
  ↓
Client: Step 2로 이동
```

### 2.1.1 파일 업로드 UI
**파일**: `app/create/step1/page.tsx`

```typescript
// 데이터 소스: File input, Drag & Drop
// 처리 로직: 파일 검증 → FormData 생성
// UI 바인딩: 미리보기, 프로그레스, 에러 메시지
```

**태스크**:
- [ ] 2.1.1.1 파일 선택 기능
  - [ ] `<input type="file" accept="image/jpeg,image/png" />`
  - [ ] onChange 핸들러 구현
  - [ ] 파일 크기 검증 (10MB)
  - [ ] 파일 타입 검증 (jpg, png)
- [ ] 2.1.1.2 드래그 앤 드롭 기능
  - [ ] onDragOver, onDragLeave, onDrop 핸들러
  - [ ] isDragging 상태 관리
  - [ ] 드래그 중 UI 변경
- [ ] 2.1.1.3 이미지 미리보기
  - [ ] FileReader.readAsDataURL()
  - [ ] 미리보기 이미지 표시
- [ ] 2.1.1.4 상태 관리
  - [ ] `selectedFile: File | null`
  - [ ] `previewUrl: string | null`
  - [ ] `isUploading: boolean`
  - [ ] `uploadProgress: number`

**데이터 바인딩**:
```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

// File → State
const handleFileSelect = (file: File) => {
  setSelectedFile(file);
  const reader = new FileReader();
  reader.onload = (e) => setPreviewUrl(e.target?.result as string);
  reader.readAsDataURL(file);
};

// State → UI
{previewUrl && <img src={previewUrl} alt="미리보기" />}
```

---

### 2.1.2 Supabase Storage 업로드
**파일**: `app/create/step1/page.tsx` (계속)

```typescript
// 데이터 소스: selectedFile (File 객체)
// 처리 로직: supabase.storage.upload()
// UI 바인딩: publicUrl 반환 → DB INSERT
```

**태스크**:
- [ ] 2.1.2.1 사용자 ID 가져오기 (`getCurrentUser()`)
- [ ] 2.1.2.2 파일 경로 생성 (`${userId}/${Date.now()}_${fileName}`)
- [ ] 2.1.2.3 Storage 업로드 구현
  - [ ] `supabase.storage.from('reference-images').upload()`
  - [ ] 업로드 프로그레스 추적
  - [ ] 에러 핸들링
- [ ] 2.1.2.4 Public URL 가져오기
  - [ ] `getPublicUrl(filePath)`

**데이터 바인딩**:
```typescript
const user = await getCurrentUser();
const filePath = `${user.id}/${Date.now()}_${selectedFile.name}`;

const { data, error } = await supabase.storage
  .from('reference-images')
  .upload(filePath, selectedFile, {
    onUploadProgress: (progress) => {
      setUploadProgress((progress.loaded / progress.total) * 100);
    }
  });

if (error) {
  setError(error.message);
  return;
}

const { data: { publicUrl } } = supabase.storage
  .from('reference-images')
  .getPublicUrl(filePath);
```

---

### 2.1.3 reference_images 테이블 INSERT
**파일**: `app/create/step1/page.tsx` (계속)

```typescript
// 데이터 소스: publicUrl, file metadata
// 처리 로직: supabase.from('reference_images').insert()
// UI 바인딩: reference_image_id → sessionStorage
```

**태스크**:
- [ ] 2.1.3.1 INSERT 쿼리 구현
  - [ ] user_id, image_url, file_name, file_size
- [ ] 2.1.3.2 응답에서 ID 추출
- [ ] 2.1.3.3 sessionStorage에 저장
  - [ ] `sessionStorage.setItem('reference_image_id', id)`

**데이터 바인딩**:
```typescript
const { data: refImage, error } = await supabase
  .from('reference_images')
  .insert({
    user_id: user.id,
    image_url: publicUrl,
    file_name: selectedFile.name,
    file_size: selectedFile.size
  })
  .select()
  .single();

if (!error) {
  sessionStorage.setItem('reference_image_id', refImage.id);
  setReferenceImageId(refImage.id);
}
```

---

### 2.1.4 AI 레퍼런스 분석 API
**파일**: `app/api/analyze-reference/route.ts`

```typescript
// 데이터 소스: reference_image_id (request body)
// 처리 로직: DB 조회 → AI API 호출 → DB UPDATE
// UI 바인딩: display_tags 반환
```

**태스크**:
- [ ] 2.1.4.1 API Route 파일 생성
- [ ] 2.1.4.2 인증 검증
  - [ ] 서버 사이드 Supabase 클라이언트 사용
  - [ ] getCurrentUser() 호출
  - [ ] 미인증 시 401 반환
- [ ] 2.1.4.3 reference_image 조회
  - [ ] ID로 이미지 URL 가져오기
  - [ ] user_id 소유권 검증
- [ ] 2.1.4.4 AI API 호출
  - [ ] `lib/ai/analyze-reference.ts` import
  - [ ] 이미지 URL 전달
  - [ ] 분석 결과 파싱 (camera_angle, tone_level 등)
- [ ] 2.1.4.5 display_tags 생성
  - [ ] tone_level → "내추럴 톤"
  - [ ] camera_angle → "정면 컷"
  - [ ] 한글 태그 배열 생성
- [ ] 2.1.4.6 reference_style_features INSERT
  - [ ] 모든 스타일 필드 저장
  - [ ] display_tags 저장
  - [ ] raw_analysis (JSONB) 저장
- [ ] 2.1.4.7 응답 반환
  - [ ] `{ success: true, display_tags: [...] }`

**데이터 바인딩**:
```typescript
// Request → DB
const { reference_image_id } = await request.json();

const { data: refImage } = await supabase
  .from('reference_images')
  .select('*')
  .eq('id', reference_image_id)
  .single();

// DB → AI API
const analysis = await analyzeReferenceImage(refImage.image_url);

// AI Response → Processing
const displayTags = generateDisplayTags(analysis);
// { tone_level: 'natural', camera_angle: 'front' }
// → ["내추럴 톤", "정면 컷"]

// Processing → DB
await supabase
  .from('reference_style_features')
  .insert({
    reference_image_id,
    camera_distance: analysis.camera_distance,
    camera_angle: analysis.camera_angle,
    tone_level: analysis.tone_level,
    background_type: analysis.background_type,
    display_tags: displayTags,
    raw_analysis: analysis
  });

// DB → Response
return NextResponse.json({ success: true, display_tags: displayTags });
```

---

### 2.1.5 AI 분석 로직 구현
**파일**: `lib/ai/analyze-reference.ts`

```typescript
// 데이터 소스: 이미지 URL
// 처리 로직: AI API (GPT-4V) 호출
// UI 바인딩: 스타일 피처 JSON 반환
```

**태스크**:
- [ ] 2.1.5.1 파일 생성
- [ ] 2.1.5.2 OpenAI/Anthropic 클라이언트 초기화
- [ ] 2.1.5.3 분석 프롬프트 작성
  - [ ] ENUM 값 명시 (camera_distance: close|medium|far)
  - [ ] 개인정보 분석 금지 명시
  - [ ] JSON 응답 요청
- [ ] 2.1.5.4 API 호출 및 파싱
- [ ] 2.1.5.5 에러 핸들링 (재시도 로직)

**프롬프트 예시**:
```typescript
const prompt = `
Analyze this fashion photography and extract style parameters.
Return ONLY valid JSON.

Parameters:
- camera_distance: "close" | "medium" | "far"
- camera_angle: "front" | "side" | "diagonal" | "top"
- crop_type: "full_body" | "upper_body" | "product_only"
- light_type: "natural" | "studio" | "soft" | "dramatic"
- tone_level: "bright" | "natural" | "warm" | "cool" | "dark"
- background_type: "white" | "gray" | "lifestyle" | "outdoor" | "studio"

IMPORTANT: Do NOT analyze faces or personal information.
Focus ONLY on photography style.
`;
```

---

### 2.1.6 클라이언트에서 API 호출
**파일**: `app/create/step1/page.tsx` (계속)

```typescript
// 데이터 소스: reference_image_id
// 처리 로직: fetch('/api/analyze-reference')
// UI 바인딩: 로딩 상태 → 완료 상태 → Step 2 이동
```

**태스크**:
- [ ] 2.1.6.1 분석 시작 상태 표시
  - [ ] `isAnalyzing: true`
  - [ ] 오버레이 표시 ("스타일 분석 중...")
- [ ] 2.1.6.2 API 호출
  - [ ] POST /api/analyze-reference
  - [ ] body: { reference_image_id }
- [ ] 2.1.6.3 응답 처리
  - [ ] display_tags 받기
  - [ ] 완료 뱃지 표시
- [ ] 2.1.6.4 "다음" 버튼 활성화

**데이터 바인딩**:
```typescript
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [displayTags, setDisplayTags] = useState<string[]>([]);

const handleAnalyze = async () => {
  setIsAnalyzing(true);
  
  try {
    const response = await fetch('/api/analyze-reference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference_image_id: referenceImageId })
    });
    
    const data = await response.json();
    setDisplayTags(data.display_tags);
    setIsAnalyzing(false);
  } catch (error) {
    setError('분석 중 오류가 발생했습니다.');
    setIsAnalyzing(false);
  }
};

// UI 표시
{isAnalyzing && (
  <div className="overlay">
    <Loader2 className="animate-spin" />
    <p>스타일 분석 중...</p>
  </div>
)}

{displayTags.length > 0 && (
  <Badge variant="success">
    <CheckCircle2 /> 분석 완료
  </Badge>
)}
```

---

## 2.2 Step 2: 스타일 확인

### 데이터 흐름
```
SessionStorage: reference_image_id
  ↓
Client: Supabase 조회 (reference_images + reference_style_features)
  ↓
UI: 레퍼런스 썸네일 + display_tags 표시
  ↓
사용자: "좋아요, 다음으로" 클릭
  ↓
Client: Step 3로 이동
```

### 2.2.1 데이터 로드
**파일**: `app/create/step2/page.tsx`

```typescript
// 데이터 소스: sessionStorage.reference_image_id
// 처리 로직: Supabase JOIN 쿼리
// UI 바인딩: 이미지 + 태그 표시
```

**태스크**:
- [ ] 2.2.1.1 sessionStorage에서 ID 가져오기
- [ ] 2.2.1.2 Supabase 쿼리 구현
  - [ ] reference_images 조회
  - [ ] reference_style_features JOIN
  - [ ] display_tags, image_url 가져오기
- [ ] 2.2.1.3 useState로 데이터 저장
- [ ] 2.2.1.4 로딩 상태 관리

**데이터 바인딩**:
```typescript
const [refImage, setRefImage] = useState<any>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    const refImageId = sessionStorage.getItem('reference_image_id');
    
    const { data } = await supabase
      .from('reference_images')
      .select(`
        *,
        reference_style_features (
          display_tags,
          tone_level,
          camera_angle
        )
      `)
      .eq('id', refImageId)
      .single();
    
    setRefImage(data);
    setIsLoading(false);
  };
  
  loadData();
}, []);

// UI 표시
{refImage && (
  <img src={refImage.image_url} alt="레퍼런스" />
)}

{refImage?.reference_style_features?.display_tags.map(tag => (
  <Badge key={tag}>{tag}</Badge>
))}
```

---

## 2.3 Step 3: 상품 업로드 & 분석

### 데이터 흐름
```
사용자: 상품 이미지 선택
  ↓
Storage: product-images 버킷 업로드
  ↓
DB: product_images INSERT
  ↓
API: /api/analyze-product 호출
  ↓
AI: 상품 분석 (material, fit, details)
  ↓
DB: product_images.product_metadata UPDATE
  ↓
SessionStorage: product_image_id 저장
  ↓
Client: Step 4로 이동
```

### 2.3.1 상품 이미지 업로드
**파일**: `app/create/step3/page.tsx`

```typescript
// 데이터 소스: File input
// 처리 로직: Storage 업로드 → DB INSERT
// UI 바인딩: 업로드 상태 → product_image_id 저장
```

**태스크**:
- [ ] 2.3.1.1 파일 선택 UI (Step 1과 유사)
- [ ] 2.3.1.2 파일 검증 (10MB, jpg/png)
- [ ] 2.3.1.3 Storage 업로드 (product-images 버킷)
- [ ] 2.3.1.4 product_images INSERT
- [ ] 2.3.1.5 sessionStorage에 저장

**데이터 바인딩** (Step 1과 동일 패턴):
```typescript
const filePath = `${userId}/${Date.now()}_product.jpg`;

const { data } = await supabase.storage
  .from('product-images')
  .upload(filePath, selectedFile);

const { data: prodImage } = await supabase
  .from('product_images')
  .insert({
    user_id: userId,
    image_url: publicUrl,
    file_name: selectedFile.name,
    file_size: selectedFile.size
  })
  .select()
  .single();

sessionStorage.setItem('product_image_id', prodImage.id);
```

---

### 2.3.2 AI 상품 분석 API
**파일**: `app/api/analyze-product/route.ts`

```typescript
// 데이터 소스: product_image_id
// 처리 로직: AI 분석 → product_metadata UPDATE
// UI 바인딩: 완료 응답
```

**태스크**:
- [ ] 2.3.2.1 API Route 생성
- [ ] 2.3.2.2 인증 검증
- [ ] 2.3.2.3 product_images 조회
- [ ] 2.3.2.4 AI 분석 호출 (`lib/ai/analyze-product.ts`)
- [ ] 2.3.2.5 product_metadata UPDATE
  - [ ] material, fit, details, color, category
  - [ ] JSONB 형식으로 저장

**데이터 바인딩**:
```typescript
const { product_image_id } = await request.json();

const { data: prodImage } = await supabase
  .from('product_images')
  .select('*')
  .eq('id', product_image_id)
  .single();

const metadata = await analyzeProductImage(prodImage.image_url);
// { material: 'cotton', fit: 'slim', details: ['zipper', 'pocket'], ... }

await supabase
  .from('product_images')
  .update({ product_metadata: metadata })
  .eq('id', product_image_id);

return NextResponse.json({ success: true });
```

---

### 2.3.3 레퍼런스 컨텍스트 표시
**파일**: `app/create/step3/page.tsx` (계속)

```typescript
// 데이터 소스: sessionStorage.reference_image_id
// 처리 로직: reference_style_features 조회
// UI 바인딩: 상단 카드에 표시
```

**태스크**:
- [ ] 2.3.3.1 레퍼런스 데이터 로드 (Step 2와 동일)
- [ ] 2.3.3.2 컨텍스트 카드 UI 추가
- [ ] 2.3.3.3 썸네일 + 태그 표시

---

## 2.4 Step 4: 생성 준비 & 크레딧 체크

### 데이터 흐름
```
SessionStorage: reference_image_id + product_image_id
  ↓
Client: 두 이미지 조회 및 표시
  ↓
사용자: "생성 버튼" 클릭
  ↓
Client: users 테이블 조회 (크레딧 체크)
  ↓
크레딧 충분: /api/generate-image 호출
크레딧 부족: 모달 표시
  ↓
API: generations INSERT → 크레딧 자동 차감
  ↓
Client: /create/generating?id={generation_id} 이동
```

### 2.4.1 입력 요약 표시
**파일**: `app/create/step4/page.tsx`

```typescript
// 데이터 소스: sessionStorage (2개 ID)
// 처리 로직: Supabase 조회 (2개 이미지)
// UI 바인딩: 나란히 표시
```

**태스크**:
- [ ] 2.4.1.1 sessionStorage에서 두 ID 가져오기
- [ ] 2.4.1.2 Parallel 쿼리 (Promise.all)
  - [ ] reference_images 조회
  - [ ] product_images 조회
- [ ] 2.4.1.3 UI 표시
  - [ ] 레퍼런스 카드 (왼쪽)
  - [ ] 상품 카드 (오른쪽)
  - [ ] 비주얼 커넥터 (+, =)

**데이터 바인딩**:
```typescript
const [refImage, setRefImage] = useState<any>(null);
const [prodImage, setProdImage] = useState<any>(null);

useEffect(() => {
  const loadData = async () => {
    const refId = sessionStorage.getItem('reference_image_id');
    const prodId = sessionStorage.getItem('product_image_id');
    
    const [refData, prodData] = await Promise.all([
      supabase.from('reference_images').select('*').eq('id', refId).single(),
      supabase.from('product_images').select('*').eq('id', prodId).single()
    ]);
    
    setRefImage(refData.data);
    setProdImage(prodData.data);
  };
  
  loadData();
}, []);
```

---

### 2.4.2 크레딧 체크
**파일**: `app/create/step4/page.tsx` (계속)

```typescript
// 데이터 소스: users 테이블
// 처리 로직: credits_used vs credits_limit 비교
// UI 바인딩: 생성 가능 / 모달 표시
```

**태스크**:
- [ ] 2.4.2.1 사용자 정보 조회
  - [ ] credits_used, credits_limit, plan, credits_reset_at
- [ ] 2.4.2.2 크레딧 체크 로직
  - [ ] 엔터프라이즈: credits_limit === -1 (무제한)
  - [ ] 리셋 날짜 지났으면 자동 리셋 (서버에서)
  - [ ] credits_used < credits_limit 확인
- [ ] 2.4.2.3 크레딧 부족 시 모달 표시
  - [ ] 현재 사용량 / 제한 표시
  - [ ] 리셋 날짜 표시
  - [ ] "프로 플랜 업그레이드" CTA

**데이터 바인딩**:
```typescript
const [user, setUser] = useState<any>(null);
const [canGenerate, setCanGenerate] = useState(false);

useEffect(() => {
  const checkCredits = async () => {
    const { data: currentUser } = await supabase.auth.getUser();
    
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.user.id)
      .single();
    
    setUser(userData);
    
    // 크레딧 체크
    if (userData.credits_limit === -1) {
      setCanGenerate(true); // 무제한
    } else if (userData.credits_used >= userData.credits_limit) {
      setCanGenerate(false); // 부족
    } else {
      setCanGenerate(true); // 충분
    }
  };
  
  checkCredits();
}, []);

// 생성 버튼 클릭
const handleGenerate = () => {
  if (!canGenerate) {
    showCreditModal(); // 모달 표시
    return;
  }
  
  // 생성 API 호출
  callGenerateAPI();
};
```

---

## 2.5 이미지 생성 플로우

### 데이터 흐름
```
Client: /api/generate-image 호출
  ↓
API: 인증 검증 → 크레딧 체크
  ↓
DB: generations INSERT (status: pending)
  ↓ (트리거)
DB: credits_used 자동 증가
  ↓
API: 백그라운드 작업 큐 추가
  ↓
API: generation_id 즉시 응답
  ↓
Client: /create/generating?id=xxx 이동
  ↓
[백그라운드]
Worker: generations 조회
  ↓
Worker: reference_style_features + product_images 조회
  ↓
Worker: AI 생성 프롬프트 빌드
  ↓
AI: 이미지 생성 (30초)
  ↓
Worker: Storage 저장 (generated-images)
  ↓
Worker: generations UPDATE (status: success, result_image_url)
  ↓
[폴링]
Client: 2초마다 generations 조회
  ↓
Client: status === 'success' 감지
  ↓
Client: /create/result?id=xxx 이동
```

### 2.5.1 생성 요청 API
**파일**: `app/api/generate-image/route.ts`

```typescript
// 데이터 소스: reference_image_id, product_image_id
// 처리 로직: 크레딧 체크 → generations INSERT → 백그라운드 작업
// UI 바인딩: generation_id 반환
```

**태스크**:
- [ ] 2.5.1.1 API Route 생성
- [ ] 2.5.1.2 인증 검증
- [ ] 2.5.1.3 request body 파싱
  - [ ] reference_image_id
  - [ ] product_image_id
- [ ] 2.5.1.4 크레딧 체크 (RPC)
  - [ ] `supabase.rpc('check_user_credits', { p_user_id })`
  - [ ] false면 403 반환
- [ ] 2.5.1.5 reference_style_features 조회
  - [ ] applied_style_feature_id 가져오기
- [ ] 2.5.1.6 generations INSERT
  - [ ] user_id, reference_image_id, product_image_id
  - [ ] applied_style_feature_id
  - [ ] status: 'pending'
- [ ] 2.5.1.7 크레딧 자동 차감 (트리거)
- [ ] 2.5.1.8 백그라운드 작업 큐 추가
  - [ ] Redis Queue / Supabase Edge Function
  - [ ] generation.id 전달
- [ ] 2.5.1.9 응답 즉시 반환
  - [ ] `{ generation_id, status: 'pending' }`

**데이터 바인딩**:
```typescript
// Request → Validation
const { reference_image_id, product_image_id } = await request.json();
const user = await getCurrentUser();

// DB → Credit Check
const { data: canGenerate } = await supabase.rpc('check_user_credits', {
  p_user_id: user.id
});

if (!canGenerate) {
  return NextResponse.json(
    { error: 'Credit limit exceeded' },
    { status: 403 }
  );
}

// DB → Style Feature
const { data: styleFeature } = await supabase
  .from('reference_style_features')
  .select('id')
  .eq('reference_image_id', reference_image_id)
  .single();

// DB ← Generation Insert
const { data: generation } = await supabase
  .from('generations')
  .insert({
    user_id: user.id,
    reference_image_id,
    product_image_id,
    applied_style_feature_id: styleFeature.id,
    status: 'pending'
  })
  .select()
  .single();

// Queue ← Background Job
await addToGenerationQueue(generation.id);

// Response → Client
return NextResponse.json({
  generation_id: generation.id,
  status: 'pending'
});
```

---

### 2.5.2 백그라운드 생성 작업
**파일**: `lib/ai/generate-worker.ts` (또는 Supabase Edge Function)

```typescript
// 데이터 소스: generation_id (큐에서 전달)
// 처리 로직: DB 조회 → AI 생성 → Storage 저장 → DB UPDATE
// UI 바인딩: N/A (백그라운드)
```

**태스크**:
- [ ] 2.5.2.1 파일/함수 생성
- [ ] 2.5.2.2 generation 조회
- [ ] 2.5.2.3 관련 데이터 조회 (JOIN)
  - [ ] reference_style_features
  - [ ] product_images.product_metadata
- [ ] 2.5.2.4 generation UPDATE (status: 'processing')
- [ ] 2.5.2.5 AI 생성 프롬프트 빌드
  - [ ] `buildGenerationPrompt(styleFeature, productMetadata)`
  - [ ] PRD 원칙 준수 확인
- [ ] 2.5.2.6 AI 이미지 생성 API 호출
  - [ ] DALL-E 3 / Stable Diffusion
  - [ ] 타임아웃 60초
  - [ ] 재시도 로직 (최대 3회)
- [ ] 2.5.2.7 결과 이미지 다운로드
- [ ] 2.5.2.8 Storage 저장
  - [ ] generated-images 버킷
  - [ ] 경로: `${userId}/${generation_id}.png`
- [ ] 2.5.2.9 generation UPDATE
  - [ ] status: 'success'
  - [ ] result_image_url: publicUrl
  - [ ] processing_time: 초 단위
- [ ] 2.5.2.10 에러 처리
  - [ ] status: 'failed'
  - [ ] error_message 저장

**데이터 바인딩**:
```typescript
export async function processGeneration(generationId: string) {
  const startTime = Date.now();
  
  // DB → Data
  const { data: generation } = await supabase
    .from('generations')
    .select(`
      *,
      reference_style_features(*),
      product_images(product_metadata)
    `)
    .eq('id', generationId)
    .single();
  
  // DB ← Status Update
  await supabase
    .from('generations')
    .update({ status: 'processing' })
    .eq('id', generationId);
  
  try {
    // Data → Prompt
    const prompt = buildGenerationPrompt(
      generation.reference_style_features,
      generation.product_images.product_metadata
    );
    
    // AI API → Image
    const imageBuffer = await generateImage(prompt);
    
    // Storage ← Upload
    const filePath = `${generation.user_id}/${generationId}.png`;
    await supabase.storage
      .from('generated-images')
      .upload(filePath, imageBuffer);
    
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(filePath);
    
    // DB ← Success Update
    const processingTime = Math.floor((Date.now() - startTime) / 1000);
    
    await supabase
      .from('generations')
      .update({
        status: 'success',
        result_image_url: publicUrl,
        processing_time: processingTime
      })
      .eq('id', generationId);
      
  } catch (error) {
    // DB ← Failed Update
    await supabase
      .from('generations')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('id', generationId);
  }
}
```

---

### 2.5.3 로딩 화면 폴링
**파일**: `app/create/generating/page.tsx`

```typescript
// 데이터 소스: URL params (generation_id)
// 처리 로직: 2초마다 generations 조회
// UI 바인딩: 로딩 메시지 변경 → 완료 시 리다이렉트
```

**태스크**:
- [ ] 2.5.3.1 URL params에서 ID 가져오기
- [ ] 2.5.3.2 폴링 구현 (useEffect + setInterval)
  - [ ] 2초마다 실행
  - [ ] generations.status 조회
  - [ ] success: result 페이지 이동
  - [ ] failed: 에러 모달 표시
- [ ] 2.5.3.3 로딩 메시지 변경 (8초마다)
  - [ ] 기존 로직 유지
  - [ ] 4개 메시지 순환
- [ ] 2.5.3.4 프로그레스 바 업데이트
- [ ] 2.5.3.5 취소 버튼 (선택사항)
- [ ] 2.5.3.6 cleanup (컴포넌트 unmount 시 interval 제거)

**데이터 바인딩**:
```typescript
const searchParams = useSearchParams();
const generationId = searchParams.get('id');
const router = useRouter();

const [messageIndex, setMessageIndex] = useState(0);

useEffect(() => {
  // 폴링 로직
  const pollInterval = setInterval(async () => {
    const { data: generation } = await supabase
      .from('generations')
      .select('status, result_image_url, error_message')
      .eq('id', generationId)
      .single();
    
    if (generation.status === 'success') {
      clearInterval(pollInterval);
      router.push(`/create/result?id=${generationId}`);
    } else if (generation.status === 'failed') {
      clearInterval(pollInterval);
      showErrorModal(generation.error_message);
    }
  }, 2000); // 2초마다
  
  // 메시지 변경 로직
  const messageInterval = setInterval(() => {
    setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
  }, 8000); // 8초마다
  
  return () => {
    clearInterval(pollInterval);
    clearInterval(messageInterval);
  };
}, [generationId]);

// UI
<h1>{loadingMessages[messageIndex]}</h1>
```

---

## 2.6 결과 화면

### 데이터 흐름
```
URL Params: generation_id
  ↓
Client: generations 조회 (JOIN reference_images, product_images)
  ↓
UI: 결과 이미지 크게 표시
  ↓
사용자: "다운로드" 클릭
  ↓
Client: Storage에서 다운로드 → 브라우저 다운로드 트리거
```

### 2.6.1 결과 데이터 로드
**파일**: `app/create/result/page.tsx`

```typescript
// 데이터 소스: URL params (generation_id)
// 처리 로직: Supabase JOIN 쿼리
// UI 바인딩: 결과 이미지 + 통계 표시
```

**태스크**:
- [ ] 2.6.1.1 URL params에서 ID 가져오기
- [ ] 2.6.1.2 Supabase 쿼리
  - [ ] generations 조회
  - [ ] reference_images JOIN
  - [ ] product_images JOIN
  - [ ] result_image_url, processing_time 가져오기
- [ ] 2.6.1.3 useState로 데이터 저장
- [ ] 2.6.1.4 UI 표시
  - [ ] 결과 이미지 (크게)
  - [ ] 통계 (생성 시간)
  - [ ] 다운로드/다시 만들기/새 프로젝트 버튼

**데이터 바인딩**:
```typescript
const searchParams = useSearchParams();
const generationId = searchParams.get('id');

const [generation, setGeneration] = useState<any>(null);

useEffect(() => {
  const loadResult = async () => {
    const { data } = await supabase
      .from('generations')
      .select(`
        *,
        reference_images(image_url),
        product_images(image_url)
      `)
      .eq('id', generationId)
      .single();
    
    setGeneration(data);
  };
  
  loadResult();
}, [generationId]);

// UI
{generation && (
  <>
    <img src={generation.result_image_url} alt="생성 결과" />
    <p>{generation.processing_time}초 생성</p>
  </>
)}
```

---

### 2.6.2 다운로드 구현
**파일**: `app/create/result/page.tsx` (계속)

```typescript
// 데이터 소스: generation.result_image_url
// 처리 로직: Storage download → Blob → 파일 다운로드
// UI 바인딩: 토스트 알림
```

**태스크**:
- [ ] 2.6.2.1 다운로드 함수 구현
  - [ ] Storage에서 Blob 가져오기
  - [ ] Blob URL 생성
  - [ ] `<a>` 태그로 다운로드 트리거
  - [ ] 파일명: `sellerhood_{generation_id}.png`
- [ ] 2.6.2.2 다운로드 완료 토스트 표시

**데이터 바인딩**:
```typescript
const handleDownload = async () => {
  // Storage → Blob
  const { data, error } = await supabase.storage
    .from('generated-images')
    .download(generation.result_image_url);
  
  if (error) {
    toast.error('다운로드 실패');
    return;
  }
  
  // Blob → File Download
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sellerhood_${generationId}.png`;
  a.click();
  URL.revokeObjectURL(url);
  
  // Toast
  toast.success('다운로드 완료!');
};
```

---

# 🎨 Phase 3: Interaction & Feedback (UX 개선)

**우선순위**: 🟠 High Priority  
**목표**: 에러 핸들링, 로딩 상태, UX 최적화  
**기간**: Day 7-10

---

## 3.1 전역 에러 핸들링

### 데이터 흐름
```
에러 발생 (API, DB, AI)
  ↓
Error Handler: 에러 코드 매핑
  ↓
UI: 사용자 친화적 메시지 표시 (토스트/모달)
  ↓
Sentry: 에러 로그 전송 (모니터링)
```

### 3.1.1 에러 핸들러 구현
**파일**: `lib/errors/handler.ts`

**태스크**:
- [ ] 3.1.1.1 ErrorCode enum 정의
- [ ] 3.1.1.2 사용자 메시지 매핑 객체
- [ ] 3.1.1.3 `handleError()` 함수 구현
- [ ] 3.1.1.4 Sentry 연동 (선택사항)

---

### 3.1.2 Error Boundary
**파일**: `components/common/error-boundary.tsx`

**태스크**:
- [ ] 3.1.2.1 React Error Boundary 구현
- [ ] 3.1.2.2 에러 UI 표시
- [ ] 3.1.2.3 "다시 시도" 버튼

---

## 3.2 토스트 알림 시스템

### 데이터 흐름
```
이벤트 발생 (성공/에러/로딩)
  ↓
toast() 호출
  ↓
Toaster 컴포넌트: 화면 상단에 표시
  ↓
4초 후 자동 닫힘
```

### 3.2.1 Toaster 설정
**파일**: `components/common/toaster.tsx`, `app/layout.tsx`

**태스크**:
- [ ] 3.2.1.1 `sonner` 패키지 설치
- [ ] 3.2.1.2 Toaster 컴포넌트 생성
- [ ] 3.2.1.3 layout.tsx에 추가
- [ ] 3.2.1.4 모든 이벤트에 toast 추가
  - [ ] 업로드 성공/실패
  - [ ] 분석 성공/실패
  - [ ] 생성 성공/실패
  - [ ] 다운로드 완료

---

## 3.3 로딩 상태 관리

### 3.3.1 버튼 로딩 상태
**모든 비동기 버튼**:
- [ ] 3.3.1.1 `isLoading` state 추가
- [ ] 3.3.1.2 로딩 중 버튼 disabled
- [ ] 3.3.1.3 스피너 아이콘 표시
- [ ] 3.3.1.4 중복 클릭 방지

---

## 3.4 성능 최적화 (🟢 Nice to Have)

### 3.4.1 이미지 최적화
**태스크**:
- [ ] 3.4.1.1 Next.js Image 컴포넌트 교체
- [ ] 3.4.1.2 Supabase Storage 썸네일 사용
- [ ] 3.4.1.3 lazy loading 적용

### 3.4.2 데이터 캐싱
**태스크**:
- [ ] 3.4.2.1 React Query 설치 및 설정
- [ ] 3.4.2.2 사용자 정보 5분 캐시
- [ ] 3.4.2.3 생성 목록 1분 캐시

---

# 📊 구현 우선순위 요약

## 🔴 Week 1-2 (Critical - Must Have)

### Day 1-2: Foundation
- [x] 1.1 Supabase 클라이언트 설정 (6개 태스크)
- [x] 1.2 DB 스키마 적용 (9개 태스크)
- [x] 1.3 TypeScript 타입 시스템 (8개 태스크)
- [x] 1.4 인증 시스템 구현 (13개 태스크)

### Day 3-4: Step 1-2
- [x] 2.1 Step 1 구현 (26개 태스크)
- [x] 2.2 Step 2 구현 (4개 태스크)

### Day 5-6: Step 3-4
- [x] 2.3 Step 3 구현 (13개 태스크)
- [x] 2.4 Step 4 구현 (11개 태스크)

## 🔴 Week 3 (Critical - Must Have)

### Day 7-8: 생성 플로우
- [x] 2.5.1 생성 요청 API (9개 태스크)
- [x] 2.5.2 백그라운드 작업 (10개 태스크)
- [x] 2.5.3 로딩 화면 폴링 (6개 태스크)

### Day 9: 결과 화면
- [x] 2.6 결과 화면 구현 (6개 태스크)

## 🟠 Week 3-4 (High Priority - Should Have)

### Day 10-12: UX 개선
- [ ] 3.1 전역 에러 핸들링 (6개 태스크)
- [ ] 3.2 토스트 알림 시스템 (4개 태스크)
- [ ] 3.3 로딩 상태 관리 (4개 태스크)

## 🟢 Week 4+ (Nice to Have - Could Have)

### Day 13-14: 성능 최적화
- [ ] 3.4.1 이미지 최적화 (3개 태스크)
- [ ] 3.4.2 데이터 캐싱 (3개 태스크)

---

# 🔍 데이터 흐름 전체 맵

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Journey                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [회원가입] → [로그인] → [Step 1] → [Step 2] → [Step 3]        │
│      ↓           ↓          ↓          ↓          ↓              │
│    Auth      Session    Upload     Review    Upload              │
│      ↓           ↓          ↓          ↓          ↓              │
│   users      Cookie    Storage     Tags     Storage              │
│   table                    ↓                    ↓                 │
│                      reference_images    product_images          │
│                            ↓                    ↓                 │
│                      AI Analysis         AI Analysis             │
│                            ↓                    ↓                 │
│                reference_style_features  product_metadata        │
│                            ↓                    ↓                 │
│                            └──────┬──────┘                       │
│                                   ↓                               │
│                              [Step 4]                             │
│                             Credit Check                          │
│                                   ↓                               │
│                            /api/generate-image                    │
│                                   ↓                               │
│                           generations (pending)                   │
│                                   ↓                               │
│                          Background Worker                        │
│                                   ↓                               │
│                        AI Image Generation (30s)                  │
│                                   ↓                               │
│                       Storage (generated-images)                  │
│                                   ↓                               │
│                        generations (success)                      │
│                                   ↓                               │
│                          [Generating] (Poll)                      │
│                                   ↓                               │
│                            [Result Page]                          │
│                                   ↓                               │
│                              Download                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

# 📝 구현 체크리스트 사용 방법

1. **순차 진행**: 🔴 → 🟠 → 🟢 순서로 구현
2. **Phase 단위**: Phase 1 → Phase 2 → Phase 3 순서
3. **태스크 완료**: 각 [ ] 체크박스를 [x]로 변경
4. **검증 필수**: 각 섹션의 "검증" 부분 반드시 수행
5. **데이터 바인딩**: 코드 예시의 데이터 흐름 패턴 따르기

---

**작성 완료**: 2026-02-05  
**버전**: 1.0  
**총 태스크**: 68개 그룹 (세부 태스크 200+ 개)  
**다음 단계**: Phase 1.1부터 순차 구현 시작
