-- ============================================
-- Sellerhood Storage Buckets & Policies
-- ============================================
-- Supabase Storage 버킷 생성 및 접근 정책
-- 적용 방법: Supabase Dashboard > Storage에서 실행 또는 SQL Editor에서 실행
-- ============================================

-- ============================================
-- 1. STORAGE BUCKETS 생성
-- ============================================

-- 레퍼런스 이미지 버킷 (Step 1)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reference-images',
  'reference-images',
  false, -- private (인증된 사용자만 접근)
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- 상품 이미지 버킷 (Step 3)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  false, -- private
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- 생성된 의류컷 버킷 (Result)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-images',
  'generated-images',
  true, -- public (다운로드 링크 공유 가능)
  20971520, -- 20MB (고해상도 결과물)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE storage.buckets IS 'Supabase Storage 버킷 설정';

-- ============================================
-- 2. REFERENCE-IMAGES 버킷 RLS
-- ============================================

-- 본인 레퍼런스 이미지 업로드 허용
CREATE POLICY "Users can upload own reference images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'reference-images'
    AND auth.uid()::text = (storage.foldername(name))[1] -- 폴더명 = user_id
  );

-- 본인 레퍼런스 이미지 조회 허용
CREATE POLICY "Users can view own reference images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'reference-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 본인 레퍼런스 이미지 삭제 허용
CREATE POLICY "Users can delete own reference images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'reference-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMENT ON POLICY "Users can upload own reference images" ON storage.objects IS 'reference-images 버킷: 본인 폴더에만 업로드';

-- ============================================
-- 3. PRODUCT-IMAGES 버킷 RLS
-- ============================================

-- 본인 상품 이미지 업로드 허용
CREATE POLICY "Users can upload own product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 본인 상품 이미지 조회 허용
CREATE POLICY "Users can view own product images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 본인 상품 이미지 삭제 허용
CREATE POLICY "Users can delete own product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMENT ON POLICY "Users can upload own product images" ON storage.objects IS 'product-images 버킷: 본인 폴더에만 업로드';

-- ============================================
-- 4. GENERATED-IMAGES 버킷 RLS
-- ============================================

-- 생성된 이미지는 서버(service_role)에서만 업로드
CREATE POLICY "Service role can upload generated images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'generated-images'
    AND FALSE -- 일반 사용자 차단 (service_role은 RLS 우회)
  );

-- 생성된 이미지는 public이므로 누구나 조회 가능
CREATE POLICY "Anyone can view generated images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'generated-images'
  );

-- 본인 생성 이미지만 삭제 허용
CREATE POLICY "Users can delete own generated images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'generated-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMENT ON POLICY "Anyone can view generated images" ON storage.objects IS 'generated-images 버킷: public 읽기 (다운로드 링크 공유용)';

-- ============================================
-- 5. STORAGE 사용 가이드
-- ============================================

-- 파일 경로 규칙:
-- reference-images/{user_id}/{timestamp}_{filename}.jpg
-- product-images/{user_id}/{timestamp}_{filename}.jpg
-- generated-images/{user_id}/{generation_id}.png

-- 예시: 클라이언트 업로드 코드 (TypeScript)
-- const { data, error } = await supabase.storage
--   .from('reference-images')
--   .upload(`${userId}/${Date.now()}_reference.jpg`, file);

-- ============================================
-- 6. STORAGE 정리 함수 (선택사항)
-- ============================================

-- 오래된 레퍼런스 이미지 자동 삭제 (30일 이후)
CREATE OR REPLACE FUNCTION cleanup_old_reference_images()
RETURNS void AS $$
BEGIN
  DELETE FROM public.reference_images
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Storage 파일은 별도로 정리 필요 (Supabase Edge Function 권장)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_reference_images IS '30일 이상 된 레퍼런스 이미지 자동 삭제 (cron job으로 실행 권장)';

-- ============================================
-- 완료
-- ============================================
-- 
-- ✅ 적용 완료 체크리스트:
-- 1. schema.sql 실행 완료
-- 2. rls_policies.sql 실행 완료
-- 3. storage_setup.sql 실행 완료 (현재 파일)
-- 
-- 📌 다음 단계:
-- 1. Supabase Dashboard > Storage에서 3개 버킷 생성 확인
-- 2. 각 버킷의 public/private 설정 확인
-- 3. 앱에서 환경변수 설정:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY (서버 전용)
-- 
-- 🔐 보안 체크:
-- - reference-images: private ✓
-- - product-images: private ✓
-- - generated-images: public ✓
-- - RLS 활성화: 모든 테이블 ✓
-- - Storage RLS: user_id 폴더 격리 ✓
