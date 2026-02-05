/**
 * Step 4 검증 스크립트
 * Supabase 연결 및 주요 기능 테스트
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// .env.local 로드
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function testStep4() {
  console.log('🔍 Step 4 검증 시작...\n');

  // 1. Supabase 연결 테스트
  console.log('1️⃣ Supabase 연결 테스트');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('❌ Supabase 연결 실패:', error.message);
      return;
    }
    console.log('✅ Supabase 연결 성공\n');
  } catch (err: any) {
    console.log('❌ Supabase 연결 에러:', err.message);
    return;
  }

  // 2. Storage 버킷 확인
  console.log('2️⃣ Storage 버킷 확인');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log('❌ Storage 버킷 조회 실패:', error.message);
    } else {
      const bucketNames = buckets.map((b) => b.name);
      console.log('✅ Storage 버킷:', bucketNames);
      
      const requiredBuckets = ['reference-images', 'product-images', 'generated-images'];
      const missingBuckets = requiredBuckets.filter((b) => !bucketNames.includes(b));
      
      if (missingBuckets.length > 0) {
        console.log('⚠️  누락된 버킷:', missingBuckets);
      } else {
        console.log('✅ 모든 필수 버킷 존재\n');
      }
    }
  } catch (err: any) {
    console.log('❌ Storage 버킷 조회 에러:', err.message);
  }

  // 3. 테이블 구조 확인
  console.log('3️⃣ 테이블 구조 확인');
  const tables = ['users', 'reference_images', 'reference_style_features', 'product_images', 'generations'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table as any).select('*').limit(1);
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: 정상`);
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  console.log('\n4️⃣ RLS 정책 확인');
  console.log('⚠️  RLS 정책은 Supabase Dashboard에서 확인하세요:');
  console.log(`   ${supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/database/policies')}`);

  console.log('\n5️⃣ 환경 변수 확인');
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '설정됨' : '❌ 없음');
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '설정됨' : '❌ 없음');
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '설정됨' : '❌ 없음');

  console.log('\n✅ Step 4 검증 완료!');
  console.log('\n📝 수동 테스트 항목:');
  console.log('   1. http://localhost:3000/login 접속');
  console.log('   2. DEV 로그인 버튼 클릭');
  console.log('   3. /create/step1로 이동 확인');
  console.log('   4. 이미지 업로드 테스트 (드래그 앤 드롭 or 파일 선택)');
  console.log('   5. 업로드 진행 상태 확인');
  console.log('   6. AI 분석 진행 상태 확인 (약 2초)');
  console.log('   7. "스타일 분석 완료" 뱃지 및 Display Tags 확인');
  console.log('   8. "다음" 버튼 활성화 확인');
  console.log('   9. Supabase Dashboard에서 데이터 확인:');
  console.log('      - Storage: reference-images 버킷');
  console.log('      - Table: reference_images, reference_style_features');
}

testStep4().catch(console.error);
