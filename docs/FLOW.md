# Sellerhood Mermaid Diagrams  
**PRD v3.0 (UI/UX Aligned) 기반**

---

## 1. 사용자 여정 및 로직 흐름 (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber

    actor User as 👤 사용자<br/>(쇼핑몰 셀러)
    participant Landing as 🏠 Landing<br/>Page
    participant Auth as 🔐 Login<br/>Page
    participant Step1 as 📸 Step 1<br/>레퍼런스 업로드
    participant Step2 as ✅ Step 2<br/>스타일 확인
    participant Step3 as 👕 Step 3<br/>상품 업로드
    participant Step4 as 🎯 Step 4<br/>생성 버튼
    participant Loading as ⏳ Loading<br/>생성 중
    participant Result as 🎉 Result<br/>결과 화면
    participant API as ⚙️ API<br/>Routes
    participant AI as 🤖 External<br/>AI API
    participant DB as 🗄️ Supabase<br/>DB
    participant Storage as 📦 Supabase<br/>Storage

    %% ===== 랜딩 & 로그인 =====
    rect rgb(240, 249, 255)
        Note over User, Auth: 🚀 진입 단계
        User->>Landing: 서비스 접속
        Note right of Landing: "제품 사진만으로<br/>원클릭 AI 의류컷 자동생성"
        User->>Landing: "무료로 시작하기" 클릭
        Landing->>Auth: 로그인 페이지 이동
        User->>Auth: 이메일/비밀번호 입력
        Auth->>DB: 인증 요청
        DB-->>Auth: 세션 토큰 반환
        Auth->>Step1: 인증 성공 → Step 1 이동
    end

    %% ===== Step 1: 레퍼런스 업로드 =====
    rect rgb(255, 251, 235)
        Note over User, AI: 📸 Step 1: 레퍼런스 업로드
        User->>Step1: 레퍼런스 이미지 드래그 & 드롭
        Step1->>Storage: 이미지 업로드
        Storage-->>Step1: image_url 반환

        Step1->>API: POST /api/analyze-reference
        API->>AI: 스타일 분석 요청
        AI-->>API: style_features 반환

        API->>DB: 레퍼런스 데이터 저장
        DB-->>API: 저장 완료
        API-->>Step1: 분석 완료

        User->>Step1: "다음" 클릭
        Step1->>Step2: Step 2 이동
    end

    %% ===== Step 2: 스타일 확인 =====
    rect rgb(243, 244, 246)
        Note over User, Step2: ✅ Step 2: 스타일 확인
        Step2->>Step2: 레퍼런스 썸네일 표시
        User->>Step2: "좋아요, 다음으로" 클릭
        Step2->>Step3: Step 3 이동
    end

    %% ===== Step 3: 상품 업로드 =====
    rect rgb(236, 253, 245)
        Note over User, AI: 👕 Step 3: 상품 업로드
        User->>Step3: 상품 이미지 업로드
        Step3->>Storage: 이미지 업로드
        Storage-->>Step3: image_url 반환

        Step3->>API: POST /api/analyze-product
        API->>AI: 의류 분석 요청
        AI-->>API: product_metadata 반환

        API->>DB: 상품 정보 저장
        DB-->>API: 저장 완료
        API-->>Step3: 확인 완료

        User->>Step3: "다음" 클릭
        Step3->>Step4: Step 4 이동
    end

    %% ===== Step 4: 생성 버튼 =====
    rect rgb(254, 242, 242)
        Note over User, Step4: 🎯 Step 4: 생성 버튼
        User->>Step4: "이 스타일로 의류컷 만들기" 클릭
        Step4->>Loading: 로딩 화면 이동
    end

    %% ===== 생성 중 =====
    rect rgb(245, 243, 255)
        Note over Loading, AI: ⏳ 생성 중
        Loading->>API: POST /api/generate-image
        API->>AI: 이미지 생성 요청
        AI-->>API: result_image_url 반환
        API->>Storage: 결과 이미지 저장
        Loading->>Result: 결과 화면 이동
    end

    %% ===== 결과 확인 =====
    rect rgb(254, 249, 195)
        Note over User, Result: 🎉 결과 확인
        Result->>Result: 결과 이미지 표시
        User->>Result: 다운로드 클릭
        Result->>Storage: 이미지 다운로드 요청
        Storage-->>User: 이미지 파일 다운로드
    end

---
flowchart TB

    subgraph UserFlow["👤 User Flow"]
        Landing["🏠 Landing Page"]
        Login["🔐 Login Page"]
        Step1["📸 Step 1: 레퍼런스 업로드"]
        Step2["✅ Step 2: 스타일 확인"]
        Step3["👕 Step 3: 상품 업로드"]
        Step4["🎯 Step 4: 생성 버튼"]
        Loading["⏳ Generating"]
        Result["🎉 Result"]
        Complete["✅ Complete"]
    end

    Landing --> Login
    Login --> Step1
    Step1 --> Step2
    Step2 --> Step3
    Step3 --> Step4
    Step4 --> Loading
    Loading --> Result
    Result --> Complete
    Result -.-> Step4
    Result -.-> Step1

    subgraph Server["⚙️ Next.js API Routes"]
        API1["/api/analyze-reference"]
        API2["/api/analyze-product"]
        API3["/api/generate-image"]
    end

    subgraph Supabase["☁️ Supabase"]
        Auth[(Auth)]
        DB[(Database)]
        Storage[(Storage)]
    end

    subgraph ExternalAI["🤖 External AI API"]
        AnalyzeAPI["분석 API"]
        GenerateAPI["생성 API"]
    end

    Login --> Auth
    Step1 --> Storage
    Step1 --> API1
    Step3 --> Storage
    Step3 --> API2
    Step4 --> API3
    Result --> Storage

    API1 --> AnalyzeAPI
    API2 --> AnalyzeAPI
    API3 --> GenerateAPI
    API3 --> Storage
    API1 --> DB
    API2 --> DB
    API3 --> DB