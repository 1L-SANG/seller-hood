-- ============================================
-- Sellerhood RLS (Row Level Security) Policies
-- ============================================
-- 사용자별 데이터 격리 및 접근 제어
-- 적용 방법: schema.sql 실행 후 Supabase SQL Editor에서 실행
-- ============================================

-- ============================================
-- 1. RLS 활성화
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_style_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. USERS 테이블 RLS
-- ============================================

-- 사용자 본인 정보만 조회
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- 사용자 본인 정보만 수정
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 신규 가입 시 자동 생성 (Supabase Auth 트리거 or 앱에서 처리)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

COMMENT ON POLICY "Users can view own profile" ON public.users IS '본인 프로필 조회만 가능';

-- ============================================
-- 3. REFERENCE_IMAGES 테이블 RLS
-- ============================================

-- 본인 레퍼런스 이미지만 조회
CREATE POLICY "Users can view own reference images"
  ON public.reference_images
  FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 레퍼런스 이미지 생성 (크레딧 체크는 앱 레벨에서)
CREATE POLICY "Users can insert own reference images"
  ON public.reference_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 레퍼런스 이미지 삭제
CREATE POLICY "Users can delete own reference images"
  ON public.reference_images
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can view own reference images" ON public.reference_images IS '본인 레퍼런스 이미지만 접근';

-- ============================================
-- 4. REFERENCE_STYLE_FEATURES 테이블 RLS
-- ============================================

-- 본인 레퍼런스의 스타일 피처만 조회
CREATE POLICY "Users can view own style features"
  ON public.reference_style_features
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reference_images
      WHERE reference_images.id = reference_style_features.reference_image_id
        AND reference_images.user_id = auth.uid()
    )
  );

-- 스타일 피처 생성은 시스템(서버 API)에서만 가능
-- ⚠️ 클라이언트에서 직접 INSERT 불가 (service_role 키로만 생성)
CREATE POLICY "Service role can insert style features"
  ON public.reference_style_features
  FOR INSERT
  WITH CHECK (
    -- service_role은 RLS를 우회하므로 이 정책은 일반 사용자 차단용
    FALSE
  );

COMMENT ON POLICY "Users can view own style features" ON public.reference_style_features IS '본인 레퍼런스의 스타일 피처만 조회';

-- ============================================
-- 5. PRODUCT_IMAGES 테이블 RLS
-- ============================================

-- 본인 상품 이미지만 조회
CREATE POLICY "Users can view own product images"
  ON public.product_images
  FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 상품 이미지 생성
CREATE POLICY "Users can insert own product images"
  ON public.product_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 상품 이미지 삭제
CREATE POLICY "Users can delete own product images"
  ON public.product_images
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can view own product images" ON public.product_images IS '본인 상품 이미지만 접근';

-- ============================================
-- 6. GENERATIONS 테이블 RLS
-- ============================================

-- 본인 생성 기록만 조회
CREATE POLICY "Users can view own generations"
  ON public.generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- 생성 요청 시 크레딧 체크 (앱 레벨에서 use_user_credit 함수 호출 필수)
CREATE POLICY "Users can insert own generations with credit check"
  ON public.generations
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND check_user_credits(auth.uid()) = TRUE
  );

-- 생성 상태 업데이트는 시스템(서버 API)에서만 가능
-- ⚠️ 클라이언트에서 status를 임의로 변경 불가
CREATE POLICY "Service role can update generations"
  ON public.generations
  FOR UPDATE
  USING (
    -- service_role은 RLS를 우회하므로 이 정책은 일반 사용자 차단용
    FALSE
  );

-- 본인 생성 기록 삭제 (히스토리 관리용)
CREATE POLICY "Users can delete own generations"
  ON public.generations
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can view own generations" ON public.generations IS '본인 생성 기록만 조회';
COMMENT ON POLICY "Users can insert own generations with credit check" ON public.generations IS '크레딧 체크 후 생성 요청 가능';

-- ============================================
-- 7. 추가 보안 정책
-- ============================================

-- 크레딧 초과 방지: 트리거로 이중 체크
CREATE OR REPLACE FUNCTION check_credit_before_generation()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_user_credits(NEW.user_id) THEN
    RAISE EXCEPTION 'Credit limit exceeded. Please upgrade your plan.';
  END IF;
  
  -- 크레딧 차감
  PERFORM use_user_credit(NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_credit_check
  BEFORE INSERT ON public.generations
  FOR EACH ROW
  EXECUTE FUNCTION check_credit_before_generation();

COMMENT ON TRIGGER enforce_credit_check ON public.generations IS '생성 요청 시 크레딧 자동 체크 및 차감';

-- ============================================
-- 완료
-- ============================================
-- 다음 단계: storage_setup.sql 실행
-- 
-- ⚠️ 중요 보안 원칙:
-- 1. reference_style_features와 generations 상태 업데이트는 서버 API에서만 (service_role 키 사용)
-- 2. 클라이언트는 SELECT와 생성 요청(INSERT)만 가능
-- 3. 크레딧 체크는 RLS + 트리거로 이중 방어
