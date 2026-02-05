-- ============================================
-- Sellerhood Database Schema
-- ============================================
-- PRD v3.0 기반 + 실제 UI 코드 요구사항 반영
-- 적용 방법: Supabase SQL Editor에서 순서대로 실행
-- ============================================

-- ============================================
-- 1. ENUM TYPES 정의
-- ============================================

-- 사용자 플랜 타입
CREATE TYPE plan_type AS ENUM ('starter', 'pro', 'enterprise');

-- 생성 상태
CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'success', 'failed');

-- 스타일 피처 ENUM (PRD 4.2 ERD 참고)
CREATE TYPE camera_distance_type AS ENUM ('close', 'medium', 'far');
CREATE TYPE camera_angle_type AS ENUM ('front', 'side', 'diagonal', 'top');
CREATE TYPE crop_type AS ENUM ('full_body', 'upper_body', 'product_only');
CREATE TYPE light_type AS ENUM ('natural', 'studio', 'soft', 'dramatic');
CREATE TYPE tone_level_type AS ENUM ('bright', 'natural', 'warm', 'cool', 'dark');
CREATE TYPE background_type AS ENUM ('white', 'gray', 'lifestyle', 'outdoor', 'studio');

-- ============================================
-- 2. USERS 테이블 확장
-- ============================================
-- Supabase Auth의 auth.users를 확장하는 public.users 테이블

CREATE TABLE IF NOT EXISTS public.users (
  -- Primary Key (Supabase Auth UUID)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 사용자 정보
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  
  -- 플랜 및 크레딧
  plan plan_type NOT NULL DEFAULT 'starter',
  credits_limit INTEGER NOT NULL DEFAULT 10, -- 월별 생성 제한 (스타터: 10, 프로: 100)
  credits_used INTEGER NOT NULL DEFAULT 0,   -- 현재 월 사용량
  credits_reset_at TIMESTAMPTZ NOT NULL DEFAULT (DATE_TRUNC('month', NOW()) + INTERVAL '1 month'), -- 크레딧 리셋 날짜
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 인덱스
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_plan ON public.users(plan);

COMMENT ON TABLE public.users IS '사용자 프로필 및 플랜 정보';
COMMENT ON COLUMN public.users.credits_limit IS '월별 생성 가능 횟수 (스타터: 10, 프로: 100, 엔터프라이즈: 무제한은 -1)';
COMMENT ON COLUMN public.users.credits_used IS '현재 월 사용한 생성 횟수';

-- ============================================
-- 3. REFERENCE_IMAGES 테이블
-- ============================================
-- Step 1에서 업로드한 레퍼런스 이미지 저장

CREATE TABLE IF NOT EXISTS public.reference_images (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- 이미지 정보
  image_url TEXT NOT NULL, -- Supabase Storage URL (reference-images 버킷)
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_reference_images_user_id ON public.reference_images(user_id);
CREATE INDEX idx_reference_images_created_at ON public.reference_images(created_at DESC);

COMMENT ON TABLE public.reference_images IS 'Step 1: 레퍼런스 이미지 (촬영 스타일 분석 대상)';

-- ============================================
-- 4. REFERENCE_STYLE_FEATURES 테이블
-- ============================================
-- AI 분석된 스타일 피처 (⚠️ UI에 절대 노출 금지)

CREATE TABLE IF NOT EXISTS public.reference_style_features (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key
  reference_image_id UUID NOT NULL REFERENCES public.reference_images(id) ON DELETE CASCADE,
  
  -- 스타일 피처 (PRD 4.2 참고)
  camera_distance camera_distance_type,
  camera_angle camera_angle_type,
  crop_type crop_type,
  light_type light_type,
  tone_level tone_level_type,
  background_type background_type,
  
  -- UI 표시용 간단한 태그 (Step 2, Step 3에서 사용)
  display_tags TEXT[] DEFAULT '{}', -- 예: ["내추럴 톤", "정면 컷"]
  
  -- AI API 원본 응답 (디버깅용)
  raw_analysis JSONB,
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_reference_style_features_reference_image_id 
  ON public.reference_style_features(reference_image_id);

COMMENT ON TABLE public.reference_style_features IS 'AI 분석된 레퍼런스 스타일 데이터 (시스템 내부용 - UI 노출 금지)';
COMMENT ON COLUMN public.reference_style_features.display_tags IS 'UI에 표시할 간단한 태그 (예: ["내추럴 톤", "정면 컷"])';

-- ============================================
-- 5. PRODUCT_IMAGES 테이블
-- ============================================
-- Step 3에서 업로드한 상품 이미지 저장

CREATE TABLE IF NOT EXISTS public.product_images (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Key
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- 이미지 정보
  image_url TEXT NOT NULL, -- Supabase Storage URL (product-images 버킷)
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  
  -- AI 분석된 의류 정보 (소재, 디테일, 핏 등)
  product_metadata JSONB DEFAULT '{}', -- 예: {"material": "cotton", "fit": "slim", "details": ["zipper", "pocket"]}
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_product_images_user_id ON public.product_images(user_id);
CREATE INDEX idx_product_images_created_at ON public.product_images(created_at DESC);
CREATE INDEX idx_product_images_metadata ON public.product_images USING GIN(product_metadata);

COMMENT ON TABLE public.product_images IS 'Step 3: 상품 이미지 (의류 정보 분석 대상)';
COMMENT ON COLUMN public.product_images.product_metadata IS '의류 고유 정보 (소재, 디테일, 핏 등) - AI 분석 결과';

-- ============================================
-- 6. GENERATIONS 테이블
-- ============================================
-- Step 4: 생성 요청 및 결과 추적

CREATE TABLE IF NOT EXISTS public.generations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign Keys
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reference_image_id UUID NOT NULL REFERENCES public.reference_images(id) ON DELETE CASCADE,
  product_image_id UUID NOT NULL REFERENCES public.product_images(id) ON DELETE CASCADE,
  applied_style_feature_id UUID NOT NULL REFERENCES public.reference_style_features(id) ON DELETE CASCADE,
  
  -- 생성 결과
  result_image_url TEXT, -- Supabase Storage URL (generated-images 버킷)
  status generation_status NOT NULL DEFAULT 'pending',
  
  -- 처리 정보
  processing_time INTEGER, -- 초 단위 (결과 화면 통계용)
  error_message TEXT, -- 실패 시 에러 메시지
  
  -- AI API 정보 (디버깅용)
  generation_params JSONB, -- AI 생성 API에 전달한 파라미터
  
  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
CREATE INDEX idx_generations_status ON public.generations(status);
CREATE INDEX idx_generations_created_at ON public.generations(created_at DESC);
CREATE INDEX idx_generations_reference_image_id ON public.generations(reference_image_id);
CREATE INDEX idx_generations_product_image_id ON public.generations(product_image_id);

-- Updated_at 자동 갱신
CREATE TRIGGER update_generations_updated_at
  BEFORE UPDATE ON public.generations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.generations IS '생성 요청 및 결과 추적 (전체 플로우 기록)';
COMMENT ON COLUMN public.generations.processing_time IS '생성 소요 시간 (초) - 결과 화면 통계 표시용';

-- ============================================
-- 7. 유틸리티 함수
-- ============================================

-- 사용자 크레딧 체크 함수
CREATE OR REPLACE FUNCTION check_user_credits(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan plan_type;
  v_credits_used INTEGER;
  v_credits_limit INTEGER;
  v_reset_at TIMESTAMPTZ;
BEGIN
  SELECT plan, credits_used, credits_limit, credits_reset_at
  INTO v_plan, v_credits_used, v_credits_limit, v_reset_at
  FROM public.users
  WHERE id = p_user_id;
  
  -- 엔터프라이즈는 무제한 (credits_limit = -1)
  IF v_credits_limit = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- 크레딧 리셋 시간 지났으면 리셋
  IF v_reset_at < NOW() THEN
    UPDATE public.users
    SET credits_used = 0,
        credits_reset_at = DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
    WHERE id = p_user_id;
    RETURN TRUE;
  END IF;
  
  -- 크레딧 남았는지 체크
  RETURN v_credits_used < v_credits_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_user_credits IS '사용자 크레딧 체크 (월별 생성 제한 확인)';

-- 크레딧 사용 함수
CREATE OR REPLACE FUNCTION use_user_credit(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- 크레딧 체크
  IF NOT check_user_credits(p_user_id) THEN
    RETURN FALSE;
  END IF;
  
  -- 크레딧 차감
  UPDATE public.users
  SET credits_used = credits_used + 1
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION use_user_credit IS '크레딧 사용 (생성 요청 시 호출)';

-- ============================================
-- 완료
-- ============================================
-- 다음 단계: rls_policies.sql 실행
