# Sellerhood 구현 로드맵

**작성일**: 2026-02-05  
**버전**: 1.0  
**목표**: PRD v3.0 기반 MVP 완전 구현

---

## 📋 현재 상태 분석

### ✅ 완료된 작업
- [x] PRD 및 FLOW 문서 작성
- [x] UI/UX 디자인 시스템 정의
- [x] 전체 페이지 UI 구현 (Landing, Login, Signup, Step 1-4, Generating, Result)
- [x] 컴포넌트 라이브러리 구축 (Button, Input, Card, Badge 등)
- [x] Supabase 프로젝트 생성 및 환경변수 설정
- [x] DB 스키마 설계 (schema.sql, rls_policies.sql, storage_setup.sql)
- [x] DEV 로그인 우회 구현 (개발 테스트용)

### ⚠️ 미완성 작업
- [ ] Supabase SDK 설치 및 클라이언트 설정
- [ ] Supabase Auth 통합
- [ ] DB 스키마 Supabase 적용
- [ ] Storage 버킷 생성 및 정책 설정
- [ ] API Routes 구현 (이미지 분석, 생성)
- [ ] AI API 연동 (레퍼런스 분석, 상품 분석, 이미지 생성)
- [ ] 각 Step별 데이터 플로우 연결
- [ ] 크레딧 시스템 구현
- [ ] 에러 핸들링 및 로딩 상태 관리

---

## 🎯 구현 우선순위

### **Phase 1: 기반 인프라 구축 (최우선)**
Supabase 연동 및 인증 시스템 구축

### **Phase 2: 코어 플로우 구현 (핵심)**
Step 1 → Step 2 → Step 3 → Step 4 → Result 데이터 흐름

### **Phase 3: AI 연동 (기능 완성)**
실제 이미지 분석 및 생성 API 연결

### **Phase 4: 최적화 및 배포 (마무리)**
에러 핸들링, UX 개선, 성능 최적화

---

## 📌 Phase 1: 기반 인프라 구축

### **1.1 Supabase SDK 설치 및 설정**

#### 작업 내용
```bash
# 패키지 설치
pnpm add @supabase/supabase-js @supabase/ssr
```

#### 구현 파일
- `lib/supabase/client.ts` - 클라이언트 사이드 Supabase 클라이언트
- `lib/supabase/server.ts` - 서버 사이드 Supabase 클라이언트
- `lib/supabase/middleware.ts` - Next.js 미들웨어 (세션 관리)
- `middleware.ts` - 루트 미들웨어 (인증 체크)

#### 구현 로직
1. **클라이언트 생성**
   - 브라우저: `createBrowserClient`
   - 서버: `createServerClient` (쿠키 기반)
   - API Routes: `createClient` with service_role

2. **세션 관리**
   - 쿠키 기반 세션 저장
   - 자동 토큰 갱신
   - 미들웨어에서 세션 검증

---

### **1.2 Supabase DB 스키마 적용**

#### 작업 내용
```sql
-- Supabase SQL Editor에서 순서대로 실행
1. supabase/schema.sql
2. supabase/rls_policies.sql
3. supabase/storage_setup.sql
```

#### 검증 사항
- [ ] 7개 테이블 생성 확인
- [ ] ENUM 타입 생성 확인
- [ ] RLS 정책 활성화 확인
- [ ] 유틸리티 함수 동작 확인 (`check_user_credits`, `use_user_credit`)

---

### **1.3 Storage 버킷 생성**

#### 작업 내용
Supabase Dashboard > Storage에서 3개 버킷 생성 및 정책 확인

#### 버킷 구조
```
reference-images/
  {user_id}/
    {timestamp}_{filename}.jpg

product-images/
  {user_id}/
    {timestamp}_{filename}.jpg

generated-images/
  {user_id}/
    {generation_id}.png
```

#### 검증 사항
- [ ] reference-images: private, 10MB 제한
- [ ] product-images: private, 10MB 제한
- [ ] generated-images: public, 20MB 제한
- [ ] 각 버킷 RLS 정책 동작 확인

---

### **1.4 TypeScript 타입 정의**

#### 구현 파일
- `types/database.ts` - Supabase DB 타입 (테이블, ENUM)
- `types/supabase.ts` - Supabase 클라이언트 타입
- `types/index.ts` - 앱 전역 타입 (UI 컴포넌트용)

#### 구현 로직
```typescript
// types/database.ts
export type PlanType = 'starter' | 'pro' | 'enterprise';
export type GenerationStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits_limit: number;
  credits_used: number;
  created_at: string;
}

// ... 나머지 테이블 타입
```

---

## 📌 Phase 2: 인증 시스템 구축

### **2.1 회원가입 구현**

#### 수정 파일
- `app/(auth)/signup/page.tsx`

#### 구현 로직
1. **폼 검증**
   - 이름: 2자 이상
   - 이메일: 유효성 검증
   - 비밀번호: 8자 이상

2. **Supabase Auth 가입**
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email,
     password,
     options: {
       data: { name }
     }
   });
   ```

3. **users 테이블 자동 생성**
   - Supabase Auth Trigger 설정 (Database Webhooks)
   - 또는 가입 후 클라이언트에서 INSERT

4. **리다이렉트**
   - 성공: `/create/step1`
   - 실패: 에러 토스트 표시

---

### **2.2 로그인 구현**

#### 수정 파일
- `app/(auth)/login/page.tsx`

#### 구현 로직
1. **Supabase Auth 로그인**
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email,
     password
   });
   ```

2. **세션 저장**
   - 쿠키에 자동 저장 (Supabase SDK)
   - 미들웨어에서 자동 검증

3. **리다이렉트**
   - 성공: `/create/step1`
   - 실패: 에러 메시지 표시

4. **DEV 로그인 유지**
   - 기존 DEV 버튼 그대로 유지 (localStorage 기반)
   - 실제 인증과 분리

---

### **2.3 인증 가드 구현**

#### 구현 파일
- `middleware.ts` - 루트 미들웨어
- `lib/auth/session.ts` - 세션 유틸리티

#### 구현 로직
1. **보호된 경로 정의**
   ```typescript
   const protectedRoutes = [
     '/create/*',
     '/dashboard',
     '/settings'
   ];
   ```

2. **미들웨어에서 세션 체크**
   - 세션 없음: `/login`으로 리다이렉트
   - DEV 환경: `isDevAuthed()` 체크도 허용

3. **서버 컴포넌트에서 사용자 정보 가져오기**
   ```typescript
   const user = await getCurrentUser(); // server only
   ```

---

## 📌 Phase 3: Step 1 구현 (레퍼런스 업로드)

### **3.1 이미지 업로드 UI**

#### 수정 파일
- `app/create/step1/page.tsx`

#### 구현 로직
1. **파일 선택 및 드래그 앤 드롭**
   - 파일 타입 검증: jpg, png (최대 10MB)
   - 미리보기 표시
   - 업로드 프로그레스 바

2. **Supabase Storage 업로드**
   ```typescript
   const fileName = `${Date.now()}_${file.name}`;
   const filePath = `${userId}/${fileName}`;
   
   const { data, error } = await supabase.storage
     .from('reference-images')
     .upload(filePath, file);
   ```

3. **reference_images 테이블 INSERT**
   ```typescript
   const { data: refImage } = await supabase
     .from('reference_images')
     .insert({
       user_id: userId,
       image_url: publicUrl,
       file_name: file.name,
       file_size: file.size
     })
     .select()
     .single();
   ```

4. **세션 스토리지에 ID 저장**
   ```typescript
   sessionStorage.setItem('reference_image_id', refImage.id);
   ```

---

### **3.2 AI 레퍼런스 분석 API**

#### 구현 파일
- `app/api/analyze-reference/route.ts`

#### 구현 로직
1. **요청 검증**
   - 인증 체크 (server-side Supabase client)
   - reference_image_id 확인

2. **AI API 호출 (예시: OpenAI Vision)**
   ```typescript
   const analysis = await analyzeReferenceImage(imageUrl);
   // 반환값: {
   //   camera_distance: 'medium',
   //   camera_angle: 'front',
   //   tone_level: 'natural',
   //   ...
   // }
   ```

3. **display_tags 생성**
   ```typescript
   const tags = generateDisplayTags(analysis);
   // 예: ["내추럴 톤", "정면 컷"]
   ```

4. **reference_style_features INSERT**
   ```typescript
   await supabase
     .from('reference_style_features')
     .insert({
       reference_image_id: refImageId,
       camera_distance: analysis.camera_distance,
       camera_angle: analysis.camera_angle,
       tone_level: analysis.tone_level,
       background_type: analysis.background_type,
       display_tags: tags,
       raw_analysis: analysis
     });
   ```

5. **응답 반환**
   ```typescript
   return NextResponse.json({
     success: true,
     display_tags: tags
   });
   ```

---

### **3.3 로딩 상태 및 에러 핸들링**

#### 구현 로직
1. **상태 관리**
   - `isUploading`: 업로드 중
   - `isAnalyzing`: 분석 중
   - `error`: 에러 메시지

2. **UI 표시**
   - 업로드 중: 프로그레스 바
   - 분석 중: "스타일 분석 중..." 오버레이
   - 완료: 그린 체크 뱃지

3. **에러 처리**
   - 업로드 실패: 토스트 + 재시도 버튼
   - 분석 실패: 토스트 + 다른 이미지 선택 안내

---

## 📌 Phase 4: Step 2 구현 (스타일 확인)

### **4.1 스타일 데이터 불러오기**

#### 수정 파일
- `app/create/step2/page.tsx`

#### 구현 로직
1. **세션에서 reference_image_id 가져오기**
   ```typescript
   const refImageId = sessionStorage.getItem('reference_image_id');
   ```

2. **DB에서 데이터 조회**
   ```typescript
   const { data: refImage } = await supabase
     .from('reference_images')
     .select(`
       *,
       reference_style_features(
         display_tags,
         tone_level,
         camera_angle
       )
     `)
     .eq('id', refImageId)
     .single();
   ```

3. **UI 표시**
   - 레퍼런스 이미지 썸네일
   - display_tags를 뱃지로 표시
   - 스타일 분석 완료 상태

---

### **4.2 다른 이미지 선택 기능**

#### 구현 로직
1. **"다른 이미지 선택" 버튼 클릭**
   - 세션 스토리지 클리어
   - Step 1으로 리다이렉트

2. **기존 업로드 유지 옵션 (선택사항)**
   - 사용자의 이전 레퍼런스 목록 표시
   - 선택 시 재사용

---

## 📌 Phase 5: Step 3 구현 (상품 업로드)

### **5.1 상품 이미지 업로드**

#### 수정 파일
- `app/create/step3/page.tsx`

#### 구현 로직 (Step 1과 유사)
1. **파일 업로드**
   ```typescript
   const filePath = `${userId}/${Date.now()}_product.jpg`;
   await supabase.storage
     .from('product-images')
     .upload(filePath, file);
   ```

2. **product_images INSERT**
   ```typescript
   const { data: prodImage } = await supabase
     .from('product_images')
     .insert({
       user_id: userId,
       image_url: publicUrl,
       file_name: file.name,
       file_size: file.size
     })
     .select()
     .single();
   
   sessionStorage.setItem('product_image_id', prodImage.id);
   ```

---

### **5.2 AI 상품 분석 API**

#### 구현 파일
- `app/api/analyze-product/route.ts`

#### 구현 로직
1. **AI API 호출**
   ```typescript
   const metadata = await analyzeProductImage(imageUrl);
   // 반환값: {
   //   material: 'cotton',
   //   fit: 'slim',
   //   details: ['zipper', 'pocket'],
   //   color: 'navy'
   // }
   ```

2. **product_images UPDATE**
   ```typescript
   await supabase
     .from('product_images')
     .update({ product_metadata: metadata })
     .eq('id', prodImageId);
   ```

---

### **5.3 레퍼런스 컨텍스트 카드 표시**

#### 구현 로직
1. **Step 2에서 선택한 레퍼런스 정보 유지**
   - 세션에서 reference_image_id 가져오기
   - display_tags 표시

2. **UI 구성 (이미 구현됨)**
   - 레퍼런스 썸네일 + 뱃지
   - 상단에 고정 표시

---

## 📌 Phase 6: Step 4 구현 (생성 준비)

### **6.1 입력 요약 표시**

#### 수정 파일
- `app/create/step4/page.tsx`

#### 구현 로직
1. **세션에서 데이터 가져오기**
   ```typescript
   const refImageId = sessionStorage.getItem('reference_image_id');
   const prodImageId = sessionStorage.getItem('product_image_id');
   ```

2. **DB에서 조회**
   ```typescript
   const [refImage, prodImage] = await Promise.all([
     supabase.from('reference_images').select('*').eq('id', refImageId).single(),
     supabase.from('product_images').select('*').eq('id', prodImageId).single()
   ]);
   ```

3. **UI 표시 (이미 구현됨)**
   - 레퍼런스 + 상품 나란히
   - 비주얼 커넥터 (+ 아이콘)

---

### **6.2 크레딧 체크**

#### 구현 로직
1. **생성 버튼 클릭 전 체크**
   ```typescript
   const { data: user } = await supabase
     .from('users')
     .select('credits_used, credits_limit, plan')
     .eq('id', userId)
     .single();
   
   if (user.credits_limit !== -1 && user.credits_used >= user.credits_limit) {
     // 크레딧 부족 모달 표시
     return;
   }
   ```

2. **크레딧 부족 시 UI**
   - 모달: "월 생성 제한에 도달했습니다"
   - CTA: "프로 플랜으로 업그레이드"
   - 리셋 날짜 표시

---

## 📌 Phase 7: 생성 플로우 구현

### **7.1 생성 요청 API**

#### 구현 파일
- `app/api/generate-image/route.ts`

#### 구현 로직
1. **인증 및 크레딧 체크**
   ```typescript
   const canGenerate = await supabase.rpc('check_user_credits', {
     p_user_id: userId
   });
   
   if (!canGenerate) {
     return NextResponse.json({ error: 'Credit limit exceeded' }, { status: 403 });
   }
   ```

2. **generations INSERT (status: pending)**
   ```typescript
   const { data: generation } = await supabase
     .from('generations')
     .insert({
       user_id: userId,
       reference_image_id: refImageId,
       product_image_id: prodImageId,
       applied_style_feature_id: styleFeatureId,
       status: 'pending'
     })
     .select()
     .single();
   
   // 크레딧 자동 차감 (트리거)
   ```

3. **백그라운드 AI 생성 작업 큐에 추가**
   ```typescript
   await addToGenerationQueue(generation.id);
   ```

4. **즉시 응답 반환**
   ```typescript
   return NextResponse.json({
     generation_id: generation.id,
     status: 'pending'
   });
   ```

---

### **7.2 백그라운드 생성 작업**

#### 구현 파일
- `lib/ai/generate-worker.ts` (또는 Supabase Edge Function)

#### 구현 로직
1. **스타일 피처 조회**
   ```typescript
   const { data: styleFeature } = await supabase
     .from('reference_style_features')
     .select('*')
     .eq('id', styleFeatureId)
     .single();
   ```

2. **상품 메타데이터 조회**
   ```typescript
   const { data: product } = await supabase
     .from('product_images')
     .select('product_metadata')
     .eq('id', prodImageId)
     .single();
   ```

3. **AI 생성 API 호출**
   ```typescript
   const startTime = Date.now();
   
   const resultImageUrl = await generateImage({
     styleFeatures: styleFeature,
     productMetadata: product.product_metadata,
     // ⚠️ 레퍼런스 이미지 자체는 전달하지 않음 (PRD 원칙)
   });
   
   const processingTime = Math.floor((Date.now() - startTime) / 1000);
   ```

4. **결과 이미지 Storage 저장**
   ```typescript
   const resultPath = `${userId}/${generation.id}.png`;
   await supabase.storage
     .from('generated-images')
     .upload(resultPath, resultImageBuffer);
   ```

5. **generations UPDATE (status: success)**
   ```typescript
   await supabase
     .from('generations')
     .update({
       status: 'success',
       result_image_url: publicUrl,
       processing_time: processingTime
     })
     .eq('id', generation.id);
   ```

---

### **7.3 로딩 화면 폴링**

#### 수정 파일
- `app/create/generating/page.tsx`

#### 구현 로직
1. **URL 파라미터에서 generation_id 가져오기**
   ```typescript
   const searchParams = useSearchParams();
   const generationId = searchParams.get('id');
   ```

2. **2초마다 상태 폴링**
   ```typescript
   useEffect(() => {
     const interval = setInterval(async () => {
       const { data: generation } = await supabase
         .from('generations')
         .select('status, result_image_url')
         .eq('id', generationId)
         .single();
       
       if (generation.status === 'success') {
         router.push(`/create/result?id=${generationId}`);
       } else if (generation.status === 'failed') {
         // 에러 처리
       }
     }, 2000);
     
     return () => clearInterval(interval);
   }, []);
   ```

3. **로딩 메시지 변경 (기존 구현 유지)**
   - 8초마다 메시지 변경
   - 프로그레스 바 업데이트

---

## 📌 Phase 8: 결과 화면 구현

### **8.1 결과 데이터 불러오기**

#### 수정 파일
- `app/create/result/page.tsx`

#### 구현 로직
1. **generation_id로 조회**
   ```typescript
   const generationId = searchParams.get('id');
   
   const { data: generation } = await supabase
     .from('generations')
     .select(`
       *,
       reference_images(image_url),
       product_images(image_url)
     `)
     .eq('id', generationId)
     .single();
   ```

2. **UI 표시 (이미 구현됨)**
   - 결과 이미지 크게 표시
   - processing_time 통계 표시
   - 다운로드/다시 만들기 버튼

---

### **8.2 다운로드 구현**

#### 구현 로직
1. **Storage에서 이미지 다운로드**
   ```typescript
   const handleDownload = async () => {
     const { data, error } = await supabase.storage
       .from('generated-images')
       .download(generation.result_image_url);
     
     // Blob을 파일로 다운로드
     const url = URL.createObjectURL(data);
     const a = document.createElement('a');
     a.href = url;
     a.download = `sellerhood_${generation.id}.png`;
     a.click();
   };
   ```

2. **다운로드 완료 토스트**
   - "다운로드 완료!" 메시지

---

### **8.3 다시 만들기 / 새 프로젝트**

#### 구현 로직
1. **다시 만들기**
   - 같은 reference + product로 재생성
   - Step 4로 이동
   - 세션 유지

2. **새 프로젝트 시작**
   - 세션 스토리지 클리어
   - Step 1로 이동

---

## 📌 Phase 9: AI API 연동 상세

### **9.1 AI API 선정 및 설정**

#### 옵션
1. **OpenAI GPT-4 Vision** (추천)
   - 이미지 분석: GPT-4V
   - 이미지 생성: DALL-E 3

2. **Anthropic Claude 3.5 Sonnet** (비전 분석)
   - 이미지 분석만 사용

3. **Replicate** (오픈소스 모델)
   - Stable Diffusion, ControlNet 등

4. **Midjourney API** (비공식)
   - 고품질 생성

#### 환경변수 추가
```env
OPENAI_API_KEY=sk-...
# 또는
ANTHROPIC_API_KEY=sk-ant-...
REPLICATE_API_TOKEN=r8_...
```

---

### **9.2 레퍼런스 분석 프롬프트**

#### 구현 파일
- `lib/ai/analyze-reference.ts`

#### 프롬프트 예시
```typescript
const prompt = `
이미지를 분석하여 다음 스타일 요소를 JSON으로 반환해주세요:

1. camera_distance: close | medium | far
2. camera_angle: front | side | diagonal | top
3. crop_type: full_body | upper_body | product_only
4. light_type: natural | studio | soft | dramatic
5. tone_level: bright | natural | warm | cool | dark
6. background_type: white | gray | lifestyle | outdoor | studio

⚠️ 사람의 얼굴이나 개인정보는 절대 분석하지 마세요.
⚠️ 오직 촬영 스타일, 구도, 조명만 분석하세요.

반환 형식:
{
  "camera_distance": "medium",
  "camera_angle": "front",
  ...
}
`;
```

---

### **9.3 상품 분석 프롬프트**

#### 구현 파일
- `lib/ai/analyze-product.ts`

#### 프롬프트 예시
```typescript
const prompt = `
의류 상품 이미지를 분석하여 다음 정보를 JSON으로 반환해주세요:

1. material: 소재 (cotton, polyester, leather, denim 등)
2. fit: 핏 (slim, regular, oversized, loose)
3. details: 디테일 배열 (zipper, pocket, button, hood 등)
4. color: 주요 색상 (navy, black, white, beige 등)
5. category: 카테고리 (jacket, shirt, pants, dress 등)

반환 형식:
{
  "material": "cotton",
  "fit": "slim",
  "details": ["zipper", "pocket"],
  "color": "navy",
  "category": "jacket"
}
`;
```

---

### **9.4 이미지 생성 프롬프트 (⚠️ 핵심)**

#### 구현 파일
- `lib/ai/generate-image.ts`

#### 프롬프트 전략 (PRD 원칙 준수)
```typescript
function buildGenerationPrompt(
  styleFeature: StyleFeature,
  productMetadata: ProductMetadata
): string {
  // ⚠️ 레퍼런스 이미지를 직접 사용하지 않음
  // ⚠️ "복제", "모방" 등의 표현 금지
  
  return `
Create a professional product photography image with the following specifications:

CAMERA SETUP:
- Distance: ${styleFeature.camera_distance}
- Angle: ${styleFeature.camera_angle}
- Crop: ${styleFeature.crop_type}

LIGHTING:
- Type: ${styleFeature.light_type}
- Tone: ${styleFeature.tone_level}

BACKGROUND:
- Type: ${styleFeature.background_type}

PRODUCT DETAILS:
- Category: ${productMetadata.category}
- Material: ${productMetadata.material}
- Fit: ${productMetadata.fit}
- Color: ${productMetadata.color}
- Details: ${productMetadata.details.join(', ')}

REQUIREMENTS:
- Professional e-commerce photography style
- High resolution (2048x2048)
- Clean and modern aesthetic
- No human models or faces
- Focus on product presentation
- ${styleFeature.background_type} background

IMPORTANT: 
- Do NOT copy or recreate any specific existing image
- Generate a NEW composition based on the style parameters
- Ensure originality and avoid copyright concerns
`;
}
```

---

## 📌 Phase 10: 에러 핸들링 및 UX 개선

### **10.1 전역 에러 핸들링**

#### 구현 파일
- `lib/errors/handler.ts`
- `components/common/error-boundary.tsx`

#### 에러 타입 정의
```typescript
enum ErrorCode {
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  CREDIT_EXCEEDED = 'CREDIT_EXCEEDED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  GENERATION_FAILED = 'GENERATION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR'
}
```

#### 사용자 친화적 메시지
```typescript
const errorMessages = {
  AUTH_REQUIRED: '로그인이 필요합니다.',
  CREDIT_EXCEEDED: '월 생성 제한에 도달했습니다. 플랜을 업그레이드해주세요.',
  UPLOAD_FAILED: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
  // ...
};
```

---

### **10.2 로딩 상태 통합 관리**

#### 구현 파일
- `lib/store/loading-store.ts` (Zustand 또는 Context)

#### 로딩 타입
```typescript
type LoadingState = {
  isUploading: boolean;
  isAnalyzing: boolean;
  isGenerating: boolean;
  progress: number;
};
```

---

### **10.3 토스트 알림 시스템**

#### 패키지 설치
```bash
pnpm add sonner
```

#### 구현 파일
- `components/common/toaster.tsx`
- `app/layout.tsx` (Toaster 추가)

#### 사용 예시
```typescript
import { toast } from 'sonner';

toast.success('의류컷이 완성됐어요!');
toast.error('이미지 업로드에 실패했습니다.');
toast.loading('스타일을 분석하고 있어요...');
```

---

## 📌 Phase 11: 성능 최적화

### **11.1 이미지 최적화**

#### 구현 사항
1. **Next.js Image 컴포넌트 사용**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src={imageUrl}
     alt="레퍼런스 이미지"
     width={600}
     height={800}
     priority
   />
   ```

2. **Supabase Storage 이미지 변환**
   ```typescript
   const thumbnailUrl = supabase.storage
     .from('reference-images')
     .getPublicUrl(filePath, {
       transform: {
         width: 400,
         height: 600,
         quality: 80
       }
     }).data.publicUrl;
   ```

---

### **11.2 데이터 캐싱**

#### 구현 사항
1. **React Query 설치**
   ```bash
   pnpm add @tanstack/react-query
   ```

2. **캐싱 전략**
   - 사용자 정보: 5분 캐시
   - 생성 목록: 1분 캐시
   - 생성 상태 폴링: 캐시 비활성화

---

### **11.3 번들 사이즈 최적화**

#### 구현 사항
1. **Dynamic Import**
   ```typescript
   const GeneratingAnimation = dynamic(
     () => import('@/components/generating-animation'),
     { ssr: false }
   );
   ```

2. **아이콘 Tree-shaking**
   ```typescript
   // ❌ 전체 import
   import * as Icons from 'lucide-react';
   
   // ✅ 개별 import
   import { Upload, Sparkles } from 'lucide-react';
   ```

---

## 📌 Phase 12: 배포 및 모니터링

### **12.1 환경변수 설정**

#### Vercel 환경변수
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (서버 전용)
OPENAI_API_KEY=...
```

---

### **12.2 Vercel 배포**

#### 배포 스크립트
```bash
# 빌드 확인
pnpm build

# Vercel 배포
vercel --prod
```

#### 배포 체크리스트
- [ ] 환경변수 설정 완료
- [ ] DB 스키마 프로덕션 적용
- [ ] Storage 버킷 CORS 설정
- [ ] Edge Functions 배포 (백그라운드 작업)

---

### **12.3 모니터링 설정**

#### Sentry 설치 (에러 추적)
```bash
pnpm add @sentry/nextjs
```

#### Vercel Analytics (성능 모니터링)
```bash
pnpm add @vercel/analytics
```

---

## 📌 개발 순서 요약

### **Week 1: 인프라 구축**
1. ✅ Supabase SDK 설치 및 설정
2. ✅ DB 스키마 적용
3. ✅ Storage 버킷 생성
4. ✅ 타입 정의
5. ✅ 인증 시스템 구현

### **Week 2: 코어 플로우 (Step 1-3)**
1. ✅ Step 1: 레퍼런스 업로드 + 분석
2. ✅ Step 2: 스타일 확인
3. ✅ Step 3: 상품 업로드 + 분석

### **Week 3: 생성 플로우 (Step 4-Result)**
1. ✅ Step 4: 생성 준비 + 크레딧 체크
2. ✅ 생성 API + 백그라운드 작업
3. ✅ 로딩 화면 폴링
4. ✅ 결과 화면 + 다운로드

### **Week 4: AI 연동 및 최적화**
1. ✅ AI API 선정 및 프롬프트 최적화
2. ✅ 에러 핸들링 및 UX 개선
3. ✅ 성능 최적화
4. ✅ 배포 및 모니터링

---

## 📊 구현 완료 기준 (세부 체크리스트)

---

## ✅ Phase 1: 기반 인프라 (Foundation)

### **1.1 Supabase SDK 설치 및 설정**
- [ ] `@supabase/supabase-js` 패키지 설치 완료
- [ ] `@supabase/ssr` 패키지 설치 완료
- [ ] `lib/supabase/client.ts` 파일 생성 및 클라이언트 함수 구현
- [ ] `lib/supabase/server.ts` 파일 생성 및 서버 클라이언트 함수 구현
- [ ] `lib/supabase/middleware.ts` 파일 생성
- [ ] `middleware.ts` 루트 미들웨어 생성
- [ ] `.env.local` 환경변수 로드 확인 (3개 키)

**검증 방법**:
```bash
# 패키지 확인
pnpm list @supabase/supabase-js
# 환경변수 확인
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

---

### **1.2 Supabase DB 스키마 적용**
- [ ] Supabase SQL Editor 접속 완료
- [ ] `schema.sql` 실행 완료 (7개 테이블 생성)
- [ ] `rls_policies.sql` 실행 완료 (RLS 정책 적용)
- [ ] `storage_setup.sql` 실행 완료 (버킷 생성)
- [ ] ENUM 타입 생성 확인 (6개: plan_type, generation_status 등)
- [ ] `check_user_credits()` 함수 동작 확인
- [ ] `use_user_credit()` 함수 동작 확인

**검증 방법** (Supabase SQL Editor):
```sql
-- 테이블 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- ENUM 확인
SELECT typname FROM pg_type WHERE typtype = 'e';

-- 함수 확인
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';
```

---

### **1.3 Storage 버킷 생성**
- [ ] `reference-images` 버킷 생성 (private, 10MB)
- [ ] `product-images` 버킷 생성 (private, 10MB)
- [ ] `generated-images` 버킷 생성 (public, 20MB)
- [ ] 각 버킷 MIME 타입 제한 설정
- [ ] 각 버킷 RLS 정책 적용 확인

**검증 방법** (Supabase Dashboard > Storage):
- 3개 버킷이 목록에 표시됨
- public/private 설정 확인
- 파일 크기 제한 확인

---

### **1.4 TypeScript 타입 정의**
- [ ] `types/database.ts` 파일 생성
- [ ] 모든 ENUM 타입 정의 (PlanType, GenerationStatus 등)
- [ ] 모든 테이블 인터페이스 정의 (User, ReferenceImage 등)
- [ ] `types/supabase.ts` 파일 생성 (Supabase 클라이언트 타입)
- [ ] `types/index.ts` 파일 생성 (앱 전역 타입)
- [ ] 타입 에러 0개 확인

**검증 방법**:
```bash
pnpm tsc --noEmit
```

---

## ✅ Phase 2: 인증 시스템 (Authentication)

### **2.1 회원가입 구현**
- [ ] `app/(auth)/signup/page.tsx` 수정 완료
- [ ] 폼 검증 구현 (이름 2자 이상, 이메일 형식, 비밀번호 8자 이상)
- [ ] `supabase.auth.signUp()` 호출 구현
- [ ] users 테이블 자동 INSERT 구현 (trigger 또는 클라이언트)
- [ ] 회원가입 성공 시 `/create/step1` 리다이렉트
- [ ] 회원가입 실패 시 에러 토스트 표시
- [ ] 로딩 상태 UI 표시

**검증 방법**:
1. `/signup` 접속
2. 유효한 정보 입력 후 가입
3. Supabase Dashboard > Authentication > Users에서 사용자 확인
4. public.users 테이블에 레코드 생성 확인

---

### **2.2 로그인 구현**
- [ ] `app/(auth)/login/page.tsx` 수정 완료
- [ ] `supabase.auth.signInWithPassword()` 호출 구현
- [ ] 로그인 성공 시 `/create/step1` 리다이렉트
- [ ] 로그인 실패 시 에러 메시지 표시
- [ ] 세션 쿠키 저장 확인
- [ ] DEV 로그인 버튼 유지 (개발 환경만)

**검증 방법**:
1. `/login` 접속
2. 가입한 계정으로 로그인
3. 개발자 도구 > Application > Cookies에서 세션 확인
4. `/create/step1`로 리다이렉트 확인

---

### **2.3 인증 가드 구현**
- [ ] `middleware.ts` 인증 체크 로직 구현
- [ ] 보호된 경로 배열 정의 (`/create/*`, `/dashboard`)
- [ ] 미인증 시 `/login` 리다이렉트
- [ ] DEV 환경에서 `isDevAuthed()` 체크 허용
- [ ] 서버 컴포넌트용 `getCurrentUser()` 유틸 함수 구현

**검증 방법**:
1. 로그아웃 상태에서 `/create/step1` 접속 시도
2. `/login`으로 자동 리다이렉트 확인
3. 로그인 후 `/create/step1` 접근 가능 확인

---

## ✅ Phase 3: Step 1 구현 (레퍼런스 업로드)

### **3.1 이미지 업로드 UI**
- [ ] `app/create/step1/page.tsx` 파일 선택 기능 구현
- [ ] 드래그 앤 드롭 기능 구현
- [ ] 파일 타입 검증 (jpg, png만 허용)
- [ ] 파일 크기 검증 (10MB 이하)
- [ ] 이미지 미리보기 표시
- [ ] 업로드 프로그레스 바 표시
- [ ] `supabase.storage.upload()` 호출 구현
- [ ] reference_images 테이블 INSERT 구현
- [ ] sessionStorage에 reference_image_id 저장

**검증 방법**:
1. Step 1 페이지에서 이미지 선택
2. 미리보기 표시 확인
3. 업로드 완료 후 Storage 버킷 확인
4. reference_images 테이블에 레코드 확인
5. sessionStorage에 ID 저장 확인

---

### **3.2 AI 레퍼런스 분석 API**
- [ ] `app/api/analyze-reference/route.ts` 파일 생성
- [ ] 인증 검증 구현 (서버 사이드)
- [ ] AI API 클라이언트 설정 (OpenAI/Anthropic/Replicate)
- [ ] 이미지 분석 프롬프트 구현
- [ ] AI API 호출 및 응답 파싱
- [ ] display_tags 생성 로직 구현 (["내추럴 톤", "정면 컷"])
- [ ] reference_style_features 테이블 INSERT 구현
- [ ] 에러 핸들링 구현

**검증 방법**:
1. Step 1에서 이미지 업로드
2. API 호출 확인 (Network 탭)
3. reference_style_features 테이블에 레코드 확인
4. display_tags 필드에 한글 태그 배열 확인

---

### **3.3 로딩 및 에러 상태**
- [ ] 업로드 중 프로그레스 바 표시
- [ ] 분석 중 "스타일 분석 중..." 오버레이 표시
- [ ] 분석 완료 시 그린 체크 뱃지 표시
- [ ] 업로드 실패 시 토스트 + 재시도 버튼
- [ ] 분석 실패 시 토스트 + 안내 메시지
- [ ] "다음" 버튼 활성화/비활성화 로직

**검증 방법**:
1. 큰 파일 업로드 시 프로그레스 바 확인
2. 분석 중 오버레이 확인
3. 완료 후 체크 뱃지 확인
4. 네트워크 끊고 업로드 시 에러 처리 확인

---

## ✅ Phase 4: Step 2 구현 (스타일 확인)

### **4.1 스타일 데이터 불러오기**
- [ ] `app/create/step2/page.tsx` 수정
- [ ] sessionStorage에서 reference_image_id 가져오기
- [ ] Supabase에서 레퍼런스 + 스타일 피처 조회
- [ ] 레퍼런스 이미지 썸네일 표시
- [ ] display_tags를 Badge로 표시
- [ ] "스타일 분석 완료" 상태 표시

**검증 방법**:
1. Step 1 완료 후 Step 2 이동
2. 업로드한 이미지 썸네일 표시 확인
3. 태그 뱃지 표시 확인 (예: "내추럴 톤", "정면 컷")

---

### **4.2 다른 이미지 선택 기능**
- [ ] "다른 이미지 선택" 버튼 클릭 시 sessionStorage 클리어
- [ ] Step 1로 리다이렉트

**검증 방법**:
1. "다른 이미지 선택" 클릭
2. Step 1로 이동 확인
3. 이전 데이터 초기화 확인

---

## ✅ Phase 5: Step 3 구현 (상품 업로드)

### **5.1 상품 이미지 업로드**
- [ ] `app/create/step3/page.tsx` 파일 선택 구현
- [ ] 드래그 앤 드롭 구현
- [ ] 파일 검증 구현
- [ ] `supabase.storage.upload()` 호출 (product-images 버킷)
- [ ] product_images 테이블 INSERT
- [ ] sessionStorage에 product_image_id 저장

**검증 방법**:
1. Step 3에서 상품 이미지 업로드
2. Storage 버킷 확인
3. product_images 테이블 확인
4. sessionStorage 확인

---

### **5.2 AI 상품 분석 API**
- [ ] `app/api/analyze-product/route.ts` 파일 생성
- [ ] AI 상품 분석 프롬프트 구현
- [ ] product_metadata 생성 (material, fit, details 등)
- [ ] product_images.product_metadata UPDATE
- [ ] 에러 핸들링

**검증 방법**:
1. 상품 업로드 후 API 호출 확인
2. product_images 테이블의 product_metadata 필드 확인
3. JSONB 형식으로 저장 확인

---

### **5.3 레퍼런스 컨텍스트 표시**
- [ ] 상단에 레퍼런스 컨텍스트 카드 표시
- [ ] 레퍼런스 썸네일 표시
- [ ] display_tags 뱃지 표시

**검증 방법**:
1. Step 3 접속
2. 상단 카드에 Step 1의 레퍼런스 정보 표시 확인

---

## ✅ Phase 6: Step 4 구현 (생성 준비)

### **6.1 입력 요약 표시**
- [ ] `app/create/step4/page.tsx` 수정
- [ ] sessionStorage에서 두 ID 가져오기
- [ ] 레퍼런스 + 상품 이미지 조회
- [ ] 두 카드 나란히 표시
- [ ] 비주얼 커넥터 표시 (+ 아이콘)

**검증 방법**:
1. Step 4 접속
2. 레퍼런스 + 상품 썸네일 표시 확인
3. UI 레이아웃 확인

---

### **6.2 크레딧 체크**
- [ ] "생성 버튼" 클릭 전 users 테이블 조회
- [ ] credits_used vs credits_limit 비교
- [ ] 크레딧 부족 시 모달 표시
- [ ] 모달에 리셋 날짜 표시
- [ ] "프로 플랜 업그레이드" CTA 표시
- [ ] 크레딧 충분 시 생성 API 호출

**검증 방법**:
1. 스타터 플랜으로 10회 생성
2. 11번째 시도 시 모달 표시 확인
3. 모달 내용 확인 (리셋 날짜, CTA)

---

## ✅ Phase 7: 생성 플로우 (Generation)

### **7.1 생성 요청 API**
- [ ] `app/api/generate-image/route.ts` 파일 생성
- [ ] 인증 검증
- [ ] `check_user_credits()` RPC 호출
- [ ] generations 테이블 INSERT (status: pending)
- [ ] 크레딧 자동 차감 (트리거)
- [ ] 백그라운드 작업 큐 추가
- [ ] generation_id 응답 반환

**검증 방법**:
1. Step 4에서 "생성 버튼" 클릭
2. API 호출 확인 (Network 탭)
3. generations 테이블에 레코드 생성 확인
4. users.credits_used 증가 확인

---

### **7.2 백그라운드 생성 작업**
- [ ] `lib/ai/generate-worker.ts` 파일 생성 (또는 Edge Function)
- [ ] 스타일 피처 조회
- [ ] 상품 메타데이터 조회
- [ ] AI 생성 프롬프트 빌드 (PRD 원칙 준수)
- [ ] AI 이미지 생성 API 호출
- [ ] 결과 이미지 Storage 저장 (generated-images 버킷)
- [ ] generations 테이블 UPDATE (status: success, result_image_url)
- [ ] processing_time 기록
- [ ] 실패 시 status: failed, error_message 기록

**검증 방법**:
1. 생성 요청 후 대기
2. generations.status 변경 확인 (pending → processing → success)
3. result_image_url 필드 채워짐 확인
4. Storage에 결과 이미지 저장 확인
5. processing_time 기록 확인

---

### **7.3 로딩 화면 폴링**
- [ ] `app/create/generating/page.tsx` 수정
- [ ] URL 파라미터에서 generation_id 가져오기
- [ ] 2초마다 generations 테이블 폴링
- [ ] status === 'success' 시 result 페이지 이동
- [ ] status === 'failed' 시 에러 모달 표시
- [ ] 로딩 메시지 8초마다 변경 (기존 로직 유지)
- [ ] 프로그레스 바 업데이트
- [ ] "취소" 버튼 동작

**검증 방법**:
1. 생성 버튼 클릭 후 로딩 화면 확인
2. 메시지 변경 확인 (8초마다)
3. Network 탭에서 2초 폴링 확인
4. 완료 후 자동 이동 확인

---

## ✅ Phase 8: 결과 화면 (Result)

### **8.1 결과 데이터 불러오기**
- [ ] `app/create/result/page.tsx` 수정
- [ ] URL 파라미터에서 generation_id 가져오기
- [ ] generations + reference_images + product_images JOIN 조회
- [ ] 결과 이미지 크게 표시
- [ ] processing_time 통계 표시
- [ ] 다운로드/다시 만들기/새 프로젝트 버튼 표시

**검증 방법**:
1. 생성 완료 후 result 페이지 접속
2. 결과 이미지 표시 확인
3. 통계 정보 표시 확인 (생성 시간 등)

---

### **8.2 다운로드 구현**
- [ ] "다운로드" 버튼 클릭 시 Storage에서 이미지 다운로드
- [ ] Blob을 파일로 변환
- [ ] 브라우저 다운로드 트리거
- [ ] 다운로드 완료 토스트 표시

**검증 방법**:
1. "다운로드" 버튼 클릭
2. 파일 다운로드 확인
3. 파일명 확인 (sellerhood_{generation_id}.png)
4. 토스트 표시 확인

---

### **8.3 다시 만들기 / 새 프로젝트**
- [ ] "다시 만들기" 버튼: Step 4로 이동, 세션 유지
- [ ] "새 프로젝트 시작" 버튼: sessionStorage 클리어, Step 1로 이동

**검증 방법**:
1. "다시 만들기" 클릭 → Step 4 이동, 데이터 유지 확인
2. "새 프로젝트 시작" 클릭 → Step 1 이동, 데이터 초기화 확인

---

## ✅ Phase 9: AI API 연동 상세

### **9.1 AI API 설정**
- [ ] AI API 서비스 선정 (OpenAI/Anthropic/Replicate)
- [ ] API 키 환경변수 설정
- [ ] API 클라이언트 라이브러리 설치
- [ ] `lib/ai/client.ts` 파일 생성
- [ ] 레이트 리밋 핸들링 구현
- [ ] 타임아웃 설정 (30초)

**검증 방법**:
```bash
# 환경변수 확인
node -e "console.log(process.env.OPENAI_API_KEY)"
# 테스트 호출
curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

### **9.2 레퍼런스 분석 프롬프트**
- [ ] `lib/ai/analyze-reference.ts` 파일 생성
- [ ] 분석 프롬프트 작성 (스타일 요소만)
- [ ] 개인정보 분석 금지 명시
- [ ] JSON 응답 파싱 구현
- [ ] ENUM 값 매핑 구현
- [ ] 에러 핸들링 (재시도 로직)

**검증 방법**:
1. 다양한 레퍼런스 이미지로 테스트
2. 응답 JSON 형식 확인
3. ENUM 값 정확도 확인
4. 실패 케이스 테스트

---

### **9.3 상품 분석 프롬프트**
- [ ] `lib/ai/analyze-product.ts` 파일 생성
- [ ] 상품 분석 프롬프트 작성
- [ ] JSONB metadata 생성 로직
- [ ] 에러 핸들링

**검증 방법**:
1. 다양한 상품 이미지로 테스트
2. metadata 정확도 확인 (material, fit, color 등)

---

### **9.4 이미지 생성 프롬프트 (⚠️ 핵심)**
- [ ] `lib/ai/generate-image.ts` 파일 생성
- [ ] `buildGenerationPrompt()` 함수 구현
- [ ] PRD 원칙 준수 확인:
  - [ ] 레퍼런스 이미지 직접 사용 금지
  - [ ] "복제", "모방" 표현 금지
  - [ ] 스타일 파라미터만 사용
- [ ] 프롬프트에 originality 강조
- [ ] 고해상도 설정 (2048x2048)
- [ ] 에러 핸들링 및 재시도

**검증 방법**:
1. 생성된 프롬프트 로그 확인
2. "복제", "모방" 등 금지 단어 검색
3. 결과 이미지 품질 확인
4. 레퍼런스와 유사도 체크 (너무 같으면 안 됨)

---

## ✅ Phase 10: 에러 핸들링 및 UX

### **10.1 전역 에러 핸들링**
- [ ] `lib/errors/handler.ts` 파일 생성
- [ ] ErrorCode enum 정의
- [ ] 사용자 친화적 메시지 매핑
- [ ] `components/common/error-boundary.tsx` 생성
- [ ] 모든 에러를 사용자 친화적으로 표시

**검증 방법**:
1. 각 에러 타입 강제 발생
2. 사용자 메시지 표시 확인
3. 에러 로그 기록 확인

---

### **10.2 토스트 알림 시스템**
- [ ] `sonner` 패키지 설치
- [ ] `components/common/toaster.tsx` 생성
- [ ] `app/layout.tsx`에 Toaster 추가
- [ ] 성공/에러/로딩 토스트 사용

**검증 방법**:
1. 각 액션마다 토스트 표시 확인
2. 다중 토스트 스택 확인
3. 자동 닫힘 확인 (4초)

---

### **10.3 로딩 상태 관리**
- [ ] 모든 비동기 작업에 로딩 상태 추가
- [ ] 버튼 disabled 처리
- [ ] 스피너/프로그레스 표시
- [ ] 로딩 중 중복 요청 방지

**검증 방법**:
1. 각 페이지에서 로딩 상태 확인
2. 로딩 중 버튼 클릭 시 중복 요청 없음 확인

---

## ✅ Phase 11: 성능 최적화

### **11.1 이미지 최적화**
- [ ] Next.js Image 컴포넌트로 교체
- [ ] Supabase Storage 이미지 변환 사용 (썸네일)
- [ ] lazy loading 적용
- [ ] priority 속성 적절히 사용

**검증 방법**:
1. Network 탭에서 이미지 로딩 확인
2. 썸네일 크기 축소 확인
3. Lighthouse 점수 확인

---

### **11.2 데이터 캐싱**
- [ ] `@tanstack/react-query` 설치
- [ ] QueryProvider 설정
- [ ] 사용자 정보 5분 캐시
- [ ] 생성 목록 1분 캐시
- [ ] 폴링 캐시 비활성화

**검증 방법**:
1. React DevTools > Query 탭에서 캐시 확인
2. 재방문 시 캐시 히트 확인

---

### **11.3 번들 사이즈 최적화**
- [ ] Dynamic import 적용 (애니메이션 등)
- [ ] 아이콘 tree-shaking 확인
- [ ] 번들 분석 (`@next/bundle-analyzer`)

**검증 방법**:
```bash
pnpm build
pnpm analyze
```

---

## ✅ Phase 12: 배포 및 모니터링

### **12.1 환경변수 설정**
- [ ] Vercel 프로젝트 생성
- [ ] 환경변수 4개 설정 (Supabase + AI API)
- [ ] 프로덕션 환경변수 확인

**검증 방법**:
1. Vercel Dashboard > Settings > Environment Variables 확인
2. 모든 키 설정 완료 확인

---

### **12.2 빌드 및 배포**
- [ ] 로컬 빌드 성공 (`pnpm build`)
- [ ] 타입 에러 0개
- [ ] ESLint 에러 0개
- [ ] Vercel 배포 성공
- [ ] 프로덕션 URL 접속 확인

**검증 방법**:
```bash
pnpm build
pnpm start
# 브라우저에서 localhost:3000 확인
vercel --prod
```

---

### **12.3 모니터링 설정**
- [ ] Sentry 설치 및 설정
- [ ] Vercel Analytics 설치
- [ ] 에러 추적 확인
- [ ] 성능 메트릭 확인

**검증 방법**:
1. Sentry 대시보드에서 에러 수집 확인
2. Vercel Analytics에서 페이지 로딩 시간 확인

---

## ✅ 최종 통합 테스트 (E2E)

### **전체 플로우 테스트**
- [ ] **회원가입 플로우**:
  - [ ] /signup 접속
  - [ ] 정보 입력 및 가입
  - [ ] users 테이블 레코드 생성 확인
  - [ ] /create/step1 리다이렉트 확인

- [ ] **로그인 플로우**:
  - [ ] /login 접속
  - [ ] 로그인 성공
  - [ ] 세션 생성 확인
  - [ ] /create/step1 리다이렉트 확인

- [ ] **Step 1 플로우**:
  - [ ] 레퍼런스 이미지 업로드
  - [ ] Storage 저장 확인
  - [ ] AI 분석 완료 확인
  - [ ] display_tags 생성 확인
  - [ ] Step 2 이동

- [ ] **Step 2 플로우**:
  - [ ] 레퍼런스 썸네일 표시 확인
  - [ ] 태그 뱃지 표시 확인
  - [ ] "좋아요, 다음으로" 클릭
  - [ ] Step 3 이동

- [ ] **Step 3 플로우**:
  - [ ] 상품 이미지 업로드
  - [ ] Storage 저장 확인
  - [ ] AI 분석 완료 확인
  - [ ] product_metadata 생성 확인
  - [ ] Step 4 이동

- [ ] **Step 4 플로우**:
  - [ ] 레퍼런스 + 상품 요약 표시 확인
  - [ ] 크레딧 체크 확인
  - [ ] "생성 버튼" 클릭
  - [ ] generations 레코드 생성 확인
  - [ ] 로딩 화면 이동

- [ ] **Generating 플로우**:
  - [ ] 로딩 메시지 변경 확인 (8초마다)
  - [ ] 폴링 동작 확인 (2초마다)
  - [ ] 생성 완료 후 result 이동

- [ ] **Result 플로우**:
  - [ ] 결과 이미지 표시 확인
  - [ ] 통계 정보 표시 확인
  - [ ] 다운로드 동작 확인
  - [ ] 다시 만들기 동작 확인
  - [ ] 새 프로젝트 동작 확인

---

### **크레딧 시스템 테스트**
- [ ] 스타터 플랜 10회 제한 확인
- [ ] 11번째 시도 시 차단 확인
- [ ] 크레딧 부족 모달 표시 확인
- [ ] credits_used 자동 증가 확인
- [ ] 월별 리셋 로직 확인

---

### **보안 테스트**
- [ ] 미인증 사용자 /create 접근 차단 확인
- [ ] 다른 사용자 데이터 접근 차단 확인 (RLS)
- [ ] Storage 다른 사용자 폴더 접근 차단 확인
- [ ] API 인증 없이 호출 시 401 확인
- [ ] 크레딧 우회 시도 차단 확인

---

### **UX 테스트**
- [ ] 모든 페이지 반응형 디자인 확인 (모바일/태블릿/데스크톱)
- [ ] 로딩 상태 모든 액션에서 표시 확인
- [ ] 에러 메시지 사용자 친화적 표시 확인
- [ ] 토스트 알림 적절히 표시 확인
- [ ] 버튼 호버/포커스 상태 확인
- [ ] 키보드 네비게이션 확인

---

### **성능 테스트**
- [ ] Lighthouse 점수:
  - [ ] Performance: 90점 이상
  - [ ] Accessibility: 90점 이상
  - [ ] Best Practices: 90점 이상
  - [ ] SEO: 90점 이상
- [ ] 페이지 로딩 속도 < 3초 (3G 환경)
- [ ] 이미지 생성 시간 < 30초
- [ ] 번들 사이즈 < 500KB (First Load JS)

---

### **PRD 준수 검증**
- [ ] ⚠️ 레퍼런스 이미지 직접 사용 안 함 (코드 검색)
- [ ] ⚠️ UI에 camera_angle, tone_level 등 기술 데이터 노출 없음
- [ ] ⚠️ display_tags만 사용자에게 표시 확인
- [ ] ⚠️ "복제", "모방" 단어 코드에 없음 (전체 검색)
- [ ] ⚠️ 옵션 선택 UI 없음 (단일 플로우)
- [ ] ⚠️ 결과 비교 UI 없음

---

## 📊 완료 기준 요약

### **필수 완료 항목 (100% 완료 필요)**
- Phase 1-8: 모든 기능 구현 ✅
- Phase 9: AI 연동 완료 ✅
- Phase 10: 에러 핸들링 완료 ✅
- Phase 12: 배포 완료 ✅
- 최종 통합 테스트 통과 ✅
- PRD 준수 검증 통과 ✅

### **선택 완료 항목 (80% 이상 권장)**
- Phase 11: 성능 최적화 (80% 이상)
- Lighthouse 점수 (85점 이상)

---

**총 체크리스트 항목**: **231개**  
**Phase별 분포**:
- Phase 1: 23개
- Phase 2: 19개
- Phase 3: 25개
- Phase 4: 8개
- Phase 5: 13개
- Phase 6: 11개
- Phase 7: 18개
- Phase 8: 13개
- Phase 9: 18개
- Phase 10: 12개
- Phase 11: 11개
- Phase 12: 10개
- 최종 E2E: 50개

---

## 🚀 다음 단계 (Phase 2 이후)

### **고급 기능**
- [ ] 생성 히스토리 관리 (대시보드)
- [ ] 스타일 프리셋 저장/불러오기
- [ ] 다중 컷 생성 (1회 요청에 3장)
- [ ] 배치 업로드 (여러 상품 한 번에)
- [ ] 스타일 변형 강도 조절 슬라이더
- [ ] 결제 시스템 연동 (Stripe)

### **관리 기능**
- [ ] 어드민 대시보드
- [ ] 사용자 관리
- [ ] 생성 통계 및 분석
- [ ] 비용 모니터링

---

## 📝 주의사항

### **PRD 준수 원칙**
1. ⚠️ **레퍼런스 이미지는 결과 생성에 직접 사용 금지**
   - 스타일 데이터만 추출하여 사용
   - AI 프롬프트에 "복제", "모방" 표현 금지

2. ⚠️ **UI에 기술 데이터 노출 금지**
   - camera_angle, tone_level 등 직접 노출 금지
   - display_tags만 사용자에게 표시

3. ⚠️ **단일 성공 플로우 유지**
   - 옵션 선택 UI 추가 금지
   - 결과 비교 UI 추가 금지

4. ⚠️ **크레딧 시스템 엄격 운영**
   - RLS + 트리거 이중 방어
   - 클라이언트에서 우회 불가능하게 구현

---

## 🎯 최종 목표

**5일 내 MVP 완성 및 배포**

- Day 1-2: 인프라 + 인증
- Day 3-4: 코어 플로우 + AI 연동
- Day 5: 최적화 + 배포

**성공 지표**
- 셀러가 레퍼런스 업로드 → 결과 다운로드까지 **중단 없이 완료**
- 생성 결과가 **레퍼런스와 느낌은 유사하지만 동일하지 않음**
- **기술 용어 노출 0건**
- **크레딧 시스템 정상 동작**

---

**작성 완료**: 2026-02-05  
**버전**: 1.0  
**다음 단계**: 사용자 승인 후 Phase 1부터 순차 구현
