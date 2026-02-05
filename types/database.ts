/**
 * Supabase Database 타입 정의
 * schema.sql 기반
 */

// ENUM 타입
export type PlanType = 'starter' | 'pro' | 'enterprise';
export type GenerationStatus = 'pending' | 'processing' | 'success' | 'failed';
export type CameraDistanceType = 'close' | 'medium' | 'far';
export type CameraAngleType = 'front' | 'side' | 'diagonal' | 'top';
export type CropType = 'full_body' | 'upper_body' | 'product_only';
export type LightType = 'natural' | 'studio' | 'soft' | 'dramatic';
export type ToneLevelType = 'bright' | 'natural' | 'warm' | 'cool' | 'dark';
export type BackgroundType = 'white' | 'gray' | 'lifestyle' | 'outdoor' | 'studio';

// 테이블 인터페이스
export interface User {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits_limit: number;
  credits_used: number;
  credits_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReferenceImage {
  id: string;
  user_id: string;
  image_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export interface ReferenceStyleFeature {
  id: string;
  reference_image_id: string;
  camera_distance: CameraDistanceType | null;
  camera_angle: CameraAngleType | null;
  crop_type: CropType | null;
  light_type: LightType | null;
  tone_level: ToneLevelType | null;
  background_type: BackgroundType | null;
  display_tags: string[];
  raw_analysis: Record<string, any> | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  user_id: string;
  image_url: string;
  file_name: string;
  file_size: number;
  product_metadata: Record<string, any>;
  created_at: string;
}

export interface Generation {
  id: string;
  user_id: string;
  reference_image_id: string;
  product_image_id: string;
  applied_style_feature_id: string;
  result_image_url: string | null;
  status: GenerationStatus;
  processing_time: number | null;
  error_message: string | null;
  generation_params: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

// Database 타입 (Supabase 클라이언트에서 사용)
// Database Insert 타입 (created_at, updated_at은 자동 생성)
export type UserInsert = Omit<User, 'created_at' | 'updated_at'> & { id: string };
export type ReferenceImageInsert = Omit<ReferenceImage, 'id' | 'created_at'>;
export type ReferenceStyleFeatureInsert = Omit<ReferenceStyleFeature, 'id' | 'created_at'>;
export type ProductImageInsert = Omit<ProductImage, 'id' | 'created_at'>;
export type GenerationInsert = Omit<Generation, 'id' | 'created_at' | 'updated_at'>;

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      reference_images: {
        Row: ReferenceImage;
        Insert: ReferenceImageInsert;
        Update: Partial<Omit<ReferenceImage, 'id' | 'created_at'>>;
      };
      reference_style_features: {
        Row: ReferenceStyleFeature;
        Insert: ReferenceStyleFeatureInsert;
        Update: Partial<Omit<ReferenceStyleFeature, 'id' | 'created_at'>>;
      };
      product_images: {
        Row: ProductImage;
        Insert: ProductImageInsert;
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>;
      };
      generations: {
        Row: Generation;
        Insert: GenerationInsert;
        Update: Partial<Omit<Generation, 'id' | 'created_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      check_user_credits: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
      use_user_credit: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      plan_type: PlanType;
      generation_status: GenerationStatus;
      camera_distance_type: CameraDistanceType;
      camera_angle_type: CameraAngleType;
      crop_type: CropType;
      light_type: LightType;
      tone_level_type: ToneLevelType;
      background_type: BackgroundType;
    };
  };
}
