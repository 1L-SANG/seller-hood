/**
 * Step 4 E2E 테스트 스크립트
 * 실제 사용자 플로우를 시뮬레이션
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Database } from '../types/database';

// .env.local 로드
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function testStep4E2E() {
  console.log('🧪 Step 4 E2E 테스트 시작...\n');

  // 1. 테스트 사용자 생성/로그인
  console.log('1️⃣ 테스트 사용자 로그인');
  const testEmail = `test-${Date.now()}@sellerhood.dev`;
  const testPassword = 'test1234!@#$';
  
  try {
    // 회원가입
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) {
      console.log('❌ 회원가입 실패:', signUpError.message);
      
      // 이미 존재하는 경우 로그인 시도
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test1234',
      });
      
      if (signInError) {
        console.log('❌ 로그인 실패:', signInError.message);
        console.log('\n⚠️  테스트를 위해 Supabase Dashboard에서 이메일 인증을 비활성화하거나');
        console.log('   또는 기존 테스트 계정을 사용하세요.');
        return;
      }
      
      console.log('✅ 기존 계정 로그인 성공');
    } else {
      console.log('✅ 회원가입 성공:', signUpData.user?.email);
      
      // users 테이블에 프로필 생성
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: signUpData.user!.id,
          name: 'Test User',
          email: signUpData.user!.email!,
          plan: 'starter',
          credits_limit: 30,
          credits_used: 0,
          credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        } as any);
      
      if (profileError) {
        console.log('⚠️  프로필 생성 경고:', profileError.message);
      } else {
        console.log('✅ 프로필 생성 성공');
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ 사용자 정보 조회 실패');
      return;
    }
    console.log('✅ 현재 사용자 ID:', user.id, '\n');

    // 2. 테스트 이미지 생성 (1x1 PNG)
    console.log('2️⃣ 테스트 이미지 준비');
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    const testImageBlob = new Blob([testImageBuffer], { type: 'image/png' });
    console.log('✅ 테스트 이미지 생성 (1x1 PNG)\n');

    // 3. Storage 업로드 테스트
    console.log('3️⃣ Storage 업로드 테스트');
    const fileName = `${Date.now()}_test.png`;
    const filePath = `${user.id}/${fileName}`;

    console.log('   업로드 경로:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reference-images')
      .upload(filePath, testImageBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.log('❌ Storage 업로드 실패:', uploadError.message);
      console.log('\n🔍 디버깅 정보:');
      console.log('   - 버킷 이름: reference-images');
      console.log('   - 파일 경로:', filePath);
      console.log('   - 사용자 ID:', user.id);
      console.log('\n💡 해결 방법:');
      console.log('   1. Supabase Dashboard > Storage에서 reference-images 버킷 생성 확인');
      console.log('   2. Storage RLS 정책 확인 (사용자가 본인 폴더에 업로드 가능한지)');
      return;
    }

    console.log('✅ Storage 업로드 성공:', uploadData.path);

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('reference-images')
      .getPublicUrl(filePath);
    console.log('✅ Public URL:', publicUrl, '\n');

    // 4. reference_images 테이블 INSERT
    console.log('4️⃣ reference_images 테이블 INSERT');
    const { data: refImage, error: insertError } = await supabase
      .from('reference_images')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        file_name: fileName,
        file_size: testImageBuffer.length,
      } as any)
      .select()
      .single();

    if (insertError) {
      console.log('❌ DB INSERT 실패:', insertError.message);
      console.log('\n💡 해결 방법:');
      console.log('   1. schema.sql이 제대로 실행되었는지 확인');
      console.log('   2. RLS 정책 확인 (users 테이블에 프로필이 있는지)');
      return;
    }

    const imageId = (refImage as any).id;
    console.log('✅ reference_images INSERT 성공');
    console.log('   ID:', imageId, '\n');

    // 5. AI 분석 API 호출
    console.log('5️⃣ AI 분석 API 호출');
    const apiUrl = 'http://localhost:3000/api/analyze-reference';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ reference_image_id: imageId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('❌ API 호출 실패:', response.status, errorData);
        return;
      }

      const data = await response.json();
      console.log('✅ AI 분석 API 성공');
      console.log('   Display Tags:', data.display_tags);
      console.log('   Analysis:', data.analysis, '\n');

      // 6. reference_style_features 확인
      console.log('6️⃣ reference_style_features 확인');
      const { data: features, error: featuresError } = await supabase
        .from('reference_style_features')
        .select('*')
        .eq('reference_image_id', imageId)
        .single();

      if (featuresError) {
        console.log('❌ Style Features 조회 실패:', featuresError.message);
        return;
      }

      console.log('✅ Style Features 저장 확인');
      const featureRow: any = features as any;
      console.log('   Camera Angle:', featureRow.camera_angle);
      console.log('   Tone Level:', featureRow.tone_level);
      console.log('   Display Tags:', featureRow.display_tags, '\n');

      // 7. 정리 (테스트 데이터 삭제)
      console.log('7️⃣ 테스트 데이터 정리');
      
      await supabase
        .from('reference_style_features')
        .delete()
        .eq('reference_image_id', imageId);
      
      await supabase
        .from('reference_images')
        .delete()
        .eq('id', imageId);
      
      await supabase.storage
        .from('reference-images')
        .remove([filePath]);
      
      console.log('✅ 테스트 데이터 정리 완료\n');

      // 최종 결과
      console.log('🎉 Step 4 E2E 테스트 성공!');
      console.log('\n✅ 검증 완료 항목:');
      console.log('   ✓ Supabase 인증');
      console.log('   ✓ Storage 업로드');
      console.log('   ✓ reference_images INSERT');
      console.log('   ✓ AI 분석 API');
      console.log('   ✓ reference_style_features INSERT');
      console.log('   ✓ Display Tags 생성');
      
    } catch (err: any) {
      console.log('❌ API 호출 에러:', err.message);
      console.log('\n💡 해결 방법:');
      console.log('   1. 개발 서버가 실행 중인지 확인 (http://localhost:3000)');
      console.log('   2. API 라우트 파일 확인: app/api/analyze-reference/route.ts');
    }

  } catch (err: any) {
    console.log('❌ 테스트 실패:', err.message);
    console.error(err);
  }
}

testStep4E2E().catch(console.error);
