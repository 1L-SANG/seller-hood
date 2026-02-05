/**
 * Gemini API 테스트 스크립트
 * 실제 이미지 URL로 AI 분석 테스트
 */

import { config } from 'dotenv';
import { analyzeReferenceImage, generateDisplayTags } from '../lib/ai/analyze-reference';

// .env.local 로드
config({ path: '.env.local' });

async function testGeminiAPI() {
  console.log('🧪 Gemini API 테스트 시작...\n');

  // 테스트 이미지 URL (공개 이미지)
  const testImageUrl = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';
  
  console.log('📸 테스트 이미지:', testImageUrl);
  console.log('⏳ Gemini AI 분석 중...\n');

  try {
    const startTime = Date.now();
    
    // AI 분석 실행
    const analysis = await analyzeReferenceImage(testImageUrl);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('✅ 분석 완료! (소요 시간:', duration, '초)\n');
    console.log('📊 분석 결과:');
    console.log('   Camera Distance:', analysis.camera_distance);
    console.log('   Camera Angle:', analysis.camera_angle);
    console.log('   Crop Type:', analysis.crop_type);
    console.log('   Light Type:', analysis.light_type);
    console.log('   Tone Level:', analysis.tone_level);
    console.log('   Background Type:', analysis.background_type);
    console.log('');

    // Display Tags 생성
    const displayTags = generateDisplayTags(analysis);
    console.log('🏷️  Display Tags:', displayTags);
    console.log('');

    console.log('═══════════════════════════════════════════');
    console.log('🎉 Gemini API 테스트 성공!');
    console.log('═══════════════════════════════════════════');

  } catch (error: any) {
    console.error('❌ Gemini API 테스트 실패:', error.message);
    console.error(error);
  }
}

testGeminiAPI().catch(console.error);
