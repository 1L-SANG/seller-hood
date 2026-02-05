import { NextRequest, NextResponse } from 'next/server';

import { createClient, getCurrentUser } from '@/lib/supabase/server';
import {
  analyzeReferenceImage,
  generateDisplayTags,
} from '@/lib/ai/analyze-reference';

/**
 * POST /api/analyze-reference
 * 레퍼런스 이미지 AI 분석 API
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 검증
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 2. Request body 파싱
    const { reference_image_id } = await request.json();

    if (!reference_image_id) {
      return NextResponse.json(
        { error: 'reference_image_id가 필요합니다.' },
        { status: 400 }
      );
    }

    // 3. reference_images 조회 (소유권 검증)
    const supabase = await createClient();
    const { data: refImage, error: fetchError } = await supabase
      .from('reference_images')
      .select('*')
      .eq('id', reference_image_id)
      .eq('user_id', user.id) // 본인 이미지만
      .single();

    if (fetchError || !refImage) {
      return NextResponse.json(
        { error: '레퍼런스 이미지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 4. AI 이미지 분석
    const imageUrl = (refImage as any).image_url;
    console.log('[API] 레퍼런스 분석 시작:', imageUrl);
    const analysis = await analyzeReferenceImage(imageUrl);

    // 5. display_tags 생성
    const displayTags = generateDisplayTags(analysis);

    // 6. reference_style_features INSERT
    const { error: insertError } = await supabase
      .from('reference_style_features')
      .insert({
        reference_image_id,
        camera_distance: analysis.camera_distance,
        camera_angle: analysis.camera_angle,
        crop_type: analysis.crop_type,
        light_type: analysis.light_type,
        tone_level: analysis.tone_level,
        background_type: analysis.background_type,
        display_tags: displayTags,
        raw_analysis: analysis as any,
      } as any);

    if (insertError) {
      console.error('[API] reference_style_features INSERT 에러:', insertError);
      throw insertError;
    }

    console.log('[API] 분석 완료:', displayTags);

    // 7. 성공 응답
    return NextResponse.json({
      success: true,
      display_tags: displayTags,
      analysis, // 디버깅용
    });
  } catch (error: any) {
    console.error('[API] 레퍼런스 분석 에러:', error);
    return NextResponse.json(
      { error: error.message || '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
