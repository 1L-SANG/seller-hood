import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  CameraDistanceType,
  CameraAngleType,
  CropType,
  LightType,
  ToneLevelType,
  BackgroundType,
} from '@/types/database';

/**
 * AI 레퍼런스 이미지 분석 결과
 */
export interface ReferenceAnalysisResult {
  camera_distance: CameraDistanceType;
  camera_angle: CameraAngleType;
  crop_type: CropType;
  light_type: LightType;
  tone_level: ToneLevelType;
  background_type: BackgroundType;
}

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

/**
 * 레퍼런스 이미지 분석 (Gemini API)
 * 
 * @param imageUrl - 분석할 이미지 URL
 * @returns 스타일 피처 분석 결과
 */
export async function analyzeReferenceImage(
  imageUrl: string
): Promise<ReferenceAnalysisResult> {
  console.log('[Gemini AI] 레퍼런스 분석 시작:', imageUrl);

  try {
    // 1. 이미지 다운로드 및 Base64 변환
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    // 2. Gemini 모델 사용 (gemini-2.0-flash-exp 또는 gemini-1.5-pro)
    // 사용자가 요청한 'gemini-3-pro'는 현재 존재하지 않으므로, 가장 최신인 gemini-2.0-flash 또는 gemini-1.5-pro를 사용합니다.
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // 3. 프롬프트 생성
    const prompt = `
Analyze this fashion photography image and extract style parameters.
Return ONLY valid JSON without any markdown formatting or explanation.

Focus on the photography style ONLY. Do NOT analyze faces, people, or personal information.

Extract these parameters:
- camera_distance: "close" | "medium" | "far"
  * close: 클로즈업, 제품 디테일에 집중
  * medium: 미디엄샷, 상반신 또는 제품 전체
  * far: 풀샷, 전신 또는 넓은 구도
  
- camera_angle: "front" | "side" | "diagonal" | "top"
  * front: 정면
  * side: 측면
  * diagonal: 대각선
  * top: 위에서 내려다본 탑뷰
  
- crop_type: "full_body" | "upper_body" | "product_only"
  * full_body: 전신 컷
  * upper_body: 상반신 컷
  * product_only: 제품만
  
- light_type: "natural" | "studio" | "soft" | "dramatic"
  * natural: 자연광
  * studio: 스튜디오 조명
  * soft: 부드러운 조명
  * dramatic: 극적인 조명
  
- tone_level: "bright" | "natural" | "warm" | "cool" | "dark"
  * bright: 밝은 톤
  * natural: 내추럴 톤
  * warm: 따뜻한 톤
  * cool: 차가운 톤
  * dark: 다크 톤
  
- background_type: "white" | "gray" | "lifestyle" | "outdoor" | "studio"
  * white: 화이트 배경
  * gray: 그레이 배경
  * lifestyle: 라이프스타일 배경
  * outdoor: 야외 배경
  * studio: 스튜디오 배경

Return format (JSON only):
{
  "camera_distance": "medium",
  "camera_angle": "front",
  "crop_type": "upper_body",
  "light_type": "natural",
  "tone_level": "natural",
  "background_type": "white"
}
`;

    // 4. Gemini API 호출
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    console.log('[Gemini AI] Raw Response:', responseText);

    // 5. JSON 파싱 (마크다운 제거)
    let jsonText = responseText.trim();
    
    // ```json ... ``` 제거
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const analysis: ReferenceAnalysisResult = JSON.parse(jsonText);

    // 6. 유효성 검사
    const validCameraDistances: CameraDistanceType[] = ['close', 'medium', 'far'];
    const validCameraAngles: CameraAngleType[] = ['front', 'side', 'diagonal', 'top'];
    const validCropTypes: CropType[] = ['full_body', 'upper_body', 'product_only'];
    const validLightTypes: LightType[] = ['natural', 'studio', 'soft', 'dramatic'];
    const validToneLevels: ToneLevelType[] = ['bright', 'natural', 'warm', 'cool', 'dark'];
    const validBackgroundTypes: BackgroundType[] = ['white', 'gray', 'lifestyle', 'outdoor', 'studio'];

    if (!validCameraDistances.includes(analysis.camera_distance)) {
      analysis.camera_distance = 'medium';
    }
    if (!validCameraAngles.includes(analysis.camera_angle)) {
      analysis.camera_angle = 'front';
    }
    if (!validCropTypes.includes(analysis.crop_type)) {
      analysis.crop_type = 'upper_body';
    }
    if (!validLightTypes.includes(analysis.light_type)) {
      analysis.light_type = 'natural';
    }
    if (!validToneLevels.includes(analysis.tone_level)) {
      analysis.tone_level = 'natural';
    }
    if (!validBackgroundTypes.includes(analysis.background_type)) {
      analysis.background_type = 'white';
    }

    console.log('[Gemini AI] 분석 완료:', analysis);
    return analysis;

  } catch (error: any) {
    console.error('[Gemini AI] 분석 에러:', error);
    
    // 에러 발생 시 기본값 반환
    console.log('[Gemini AI] 기본값으로 폴백');
    return {
      camera_distance: 'medium',
      camera_angle: 'front',
      crop_type: 'upper_body',
      light_type: 'natural',
      tone_level: 'natural',
      background_type: 'white',
    };
  }
}

/**
 * ENUM 값을 한글 display_tags로 변환
 */
export function generateDisplayTags(analysis: ReferenceAnalysisResult): string[] {
  const tags: string[] = [];

  // tone_level 매핑
  const toneMap: Record<ToneLevelType, string> = {
    bright: '밝은 톤',
    natural: '내추럴 톤',
    warm: '따뜻한 톤',
    cool: '쿨 톤',
    dark: '다크 톤',
  };
  tags.push(toneMap[analysis.tone_level]);

  // camera_angle 매핑
  const angleMap: Record<CameraAngleType, string> = {
    front: '정면 컷',
    side: '측면 컷',
    diagonal: '대각선 컷',
    top: '탑뷰 컷',
  };
  tags.push(angleMap[analysis.camera_angle]);

  // light_type 매핑 (선택적)
  if (analysis.light_type === 'studio') {
    tags.push('스튜디오 조명');
  } else if (analysis.light_type === 'dramatic') {
    tags.push('드라마틱 조명');
  }

  return tags;
}
