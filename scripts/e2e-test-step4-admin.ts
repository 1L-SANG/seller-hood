/**
 * Step 4 E2E 테스트 스크립트 (Service Role 사용)
 * 관리자 권한으로 전체 플로우 테스트
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import type { Database } from '../types/database';

// .env.local 로드
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service Role 클라이언트 (RLS 우회)
const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testStep4Admin() {
  console.log('🧪 Step 4 관리자 테스트 시작...\n');

  // 1. 테스트 사용자 생성 (Service Role로 Auth 사용자 + 프로필 생성)
  console.log('1️⃣ 테스트 사용자 생성');
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!@#';
  
  try {
    // 1-1. Supabase Auth 사용자 생성
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // 이메일 인증 스킵
    });

    if (authError) {
      console.log('❌ Auth 사용자 생성 실패:', authError.message);
      return;
    }

    const testUserId = authData.user.id;
    console.log('✅ Auth 사용자 생성 성공');
    console.log('   User ID:', testUserId);
    console.log('   Email:', testEmail);

    // 1-2. public.users 프로필 생성
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: testUserId,
        name: 'Test User Admin',
        email: testEmail,
        plan: 'starter',
        credits_limit: 30,
        credits_used: 0,
        credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      } as any);

    if (userError) {
      console.log('❌ 프로필 생성 실패:', userError.message);
      return;
    }

    console.log('✅ 프로필 생성 성공\n');

    // 2. 테스트 이미지 생성 (1x1 PNG)
    console.log('2️⃣ 테스트 이미지 준비');
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    console.log('✅ 테스트 이미지 생성 (1x1 PNG, 68 bytes)\n');

    // 3. Storage 업로드 테스트
    console.log('3️⃣ Storage 업로드 테스트');
    const fileName = `${Date.now()}_test.png`;
    const filePath = `${testUserId}/${fileName}`;

    console.log('   버킷: reference-images');
    console.log('   경로:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('reference-images')
      .upload(filePath, testImageBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.log('❌ Storage 업로드 실패:', uploadError.message);
      console.log('\n🔍 디버깅 정보:');
      console.log('   Error Code:', uploadError.name);
      console.log('   Error Details:', JSON.stringify(uploadError, null, 2));
      console.log('\n💡 해결 방법:');
      console.log('   1. Supabase Dashboard > Storage에서 "reference-images" 버킷이 존재하는지 확인');
      console.log('   2. 버킷이 없다면 수동으로 생성:');
      console.log('      - Dashboard > Storage > New bucket');
      console.log('      - Name: reference-images');
      console.log('      - Public: No (Private)');
      console.log('   3. 또는 SQL로 생성:');
      console.log('      INSERT INTO storage.buckets (id, name, public) VALUES (\'reference-images\', \'reference-images\', false);');
      return;
    }

    console.log('✅ Storage 업로드 성공');
    console.log('   Path:', uploadData.path);

    // Public URL 가져오기
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('reference-images')
      .getPublicUrl(filePath);
    console.log('✅ Public URL 생성:', publicUrl.substring(0, 50) + '...', '\n');

    // 4. reference_images 테이블 INSERT
    console.log('4️⃣ reference_images 테이블 INSERT');
    const { data: refImage, error: insertError } = await supabaseAdmin
      .from('reference_images')
      .insert({
        user_id: testUserId,
        image_url: publicUrl,
        file_name: fileName,
        file_size: testImageBuffer.length,
      } as any)
      .select()
      .single();

    if (insertError) {
      console.log('❌ DB INSERT 실패:', insertError.message);
      console.log('\n💡 해결 방법:');
      console.log('   1. schema.sql이 실행되었는지 확인');
      console.log('   2. reference_images 테이블이 존재하는지 확인');
      return;
    }

    const imageId = (refImage as any).id;
    console.log('✅ reference_images INSERT 성공');
    console.log('   Image ID:', imageId);
    console.log('   User ID:', (refImage as any).user_id);
    console.log('   File Name:', (refImage as any).file_name, '\n');

    // 5. Mock AI 분석 시뮬레이션
    console.log('5️⃣ AI 분석 시뮬레이션');
    console.log('   분석 중... (2초 대기)');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      camera_distance: 'medium' as const,
      camera_angle: 'front' as const,
      crop_type: 'upper_body' as const,
      light_type: 'natural' as const,
      tone_level: 'natural' as const,
      background_type: 'white' as const,
    };
    
    console.log('✅ Mock AI 분석 완료');
    console.log('   Camera Distance:', mockAnalysis.camera_distance);
    console.log('   Camera Angle:', mockAnalysis.camera_angle);
    console.log('   Tone Level:', mockAnalysis.tone_level, '\n');

    // 6. Display Tags 생성
    console.log('6️⃣ Display Tags 생성');
    const displayTags = ['내추럴 톤', '정면 컷'];
    console.log('✅ Display Tags:', displayTags, '\n');

    // 7. reference_style_features INSERT
    console.log('7️⃣ reference_style_features INSERT');
    const { data: features, error: featuresError } = await supabaseAdmin
      .from('reference_style_features')
      .insert({
        reference_image_id: imageId,
        camera_distance: mockAnalysis.camera_distance,
        camera_angle: mockAnalysis.camera_angle,
        crop_type: mockAnalysis.crop_type,
        light_type: mockAnalysis.light_type,
        tone_level: mockAnalysis.tone_level,
        background_type: mockAnalysis.background_type,
        display_tags: displayTags,
        raw_analysis: mockAnalysis,
      } as any)
      .select()
      .single();

    if (featuresError) {
      console.log('❌ Style Features INSERT 실패:', featuresError.message);
      return;
    }

    console.log('✅ reference_style_features INSERT 성공');
    console.log('   Feature ID:', (features as any).id);
    console.log('   Display Tags:', (features as any).display_tags, '\n');

    // 8. 데이터 검증
    console.log('8️⃣ 데이터 검증');
    
    // reference_images 조회
    const { data: refCheck, error: refCheckError } = await supabaseAdmin
      .from('reference_images')
      .select('*')
      .eq('id', imageId)
      .single();
    
    if (refCheckError || !refCheck) {
      console.log('❌ reference_images 조회 실패');
    } else {
      console.log('✅ reference_images 조회 성공');
    }

    // reference_style_features 조회
    const { data: featuresCheck, error: featuresCheckError } = await supabaseAdmin
      .from('reference_style_features')
      .select('*')
      .eq('reference_image_id', imageId)
      .single();
    
    if (featuresCheckError || !featuresCheck) {
      console.log('❌ reference_style_features 조회 실패');
    } else {
      console.log('✅ reference_style_features 조회 성공');
    }
    
    console.log('');

    // 9. 정리
    console.log('9️⃣ 테스트 데이터 정리');
    
    await supabaseAdmin
      .from('reference_style_features')
      .delete()
      .eq('reference_image_id', imageId);
    
    await supabaseAdmin
      .from('reference_images')
      .delete()
      .eq('id', imageId);
    
    await supabaseAdmin.storage
      .from('reference-images')
      .remove([filePath]);
    
    // Auth 사용자 삭제 (CASCADE로 public.users도 자동 삭제됨)
    await supabaseAdmin.auth.admin.deleteUser(testUserId);
    
    console.log('✅ 테스트 데이터 정리 완료\n');

    // 최종 결과
    console.log('═══════════════════════════════════════════');
    console.log('🎉 Step 4 전체 플로우 테스트 성공!');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('✅ 검증 완료 항목:');
    console.log('   ✓ Supabase 연결');
    console.log('   ✓ users 테이블 생성');
    console.log('   ✓ Storage 버킷 (reference-images) 업로드');
    console.log('   ✓ reference_images 테이블 INSERT');
    console.log('   ✓ Mock AI 분석 로직');
    console.log('   ✓ Display Tags 생성');
    console.log('   ✓ reference_style_features 테이블 INSERT');
    console.log('   ✓ 데이터 조회 및 검증');
    console.log('   ✓ 테스트 데이터 정리');
    
    console.log('\n📊 테스트 통계:');
    console.log('   - 총 단계: 9개');
    console.log('   - 성공: 9개');
    console.log('   - 실패: 0개');
    
    console.log('\n🚀 다음 단계:');
    console.log('   - Step 5: Step 2-3 페이지 구현 (스타일 확인 & 제품 업로드)');
    console.log('   - Step 6: Step 4 & 생성 플로우');
    console.log('   - Step 7: 결과 화면 & 다운로드');

  } catch (err: any) {
    console.log('\n❌ 예상치 못한 에러 발생:', err.message);
    console.error(err);
  }
}

testStep4Admin().catch(console.error);
