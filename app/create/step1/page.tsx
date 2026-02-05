"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  ArrowRight,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export default function Step1Page() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [referenceImageId, setReferenceImageId] = useState<string | null>(null);
  const [displayTags, setDisplayTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isComplete = referenceImageId && displayTags.length > 0;

  // 파일 검증
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "JPG 또는 PNG 파일만 업로드 가능합니다.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "파일 크기는 10MB 이하여야 합니다.";
    }

    return null;
  };

  // 파일 처리
  const handleFile = (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 자동으로 업로드 시작
    uploadImage(file);
  };

  // 드래그 앤 드롭
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  // 파일 선택 버튼
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // 이미지 업로드 및 분석
  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const supabase = createClient();

      // 1. 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("로그인이 필요합니다.");
      }

      // 2. Storage 업로드
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${fileName}`;

      console.log("[Upload] Storage 업로드 시작:", filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("reference-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Public URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from("reference-images").getPublicUrl(filePath);

      console.log("[Upload] Public URL:", publicUrl);

      // 4. reference_images 테이블 INSERT
      const { data: refImage, error: insertError } = await supabase
        .from("reference_images")
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
        } as any)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      const imageId = (refImage as any).id;
      console.log("[Upload] reference_images INSERT 완료:", imageId);
      setReferenceImageId(imageId);
      sessionStorage.setItem("reference_image_id", imageId);

      setIsUploading(false);

      // 5. AI 분석 시작
      await analyzeImage(imageId);
    } catch (err: any) {
      console.error("[Upload] 에러:", err);
      setError(err.message || "업로드 중 오류가 발생했습니다.");
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  // AI 분석 API 호출
  const analyzeImage = async (refImageId: string) => {
    setIsAnalyzing(true);

    try {
      console.log("[Analyze] AI 분석 시작:", refImageId);

      const response = await fetch("/api/analyze-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference_image_id: refImageId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "분석 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      console.log("[Analyze] 분석 완료:", data.display_tags);

      setDisplayTags(data.display_tags);
      setIsAnalyzing(false);
    } catch (err: any) {
      console.error("[Analyze] 에러:", err);
      setError(err.message || "분석 중 오류가 발생했습니다.");
      setIsAnalyzing(false);
    }
  };

  // 이미지 제거
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setReferenceImageId(null);
    setDisplayTags([]);
    setError(null);
    sessionStorage.removeItem("reference_image_id");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === 1
                      ? "bg-gradient-to-br from-primary to-primary-light text-primary-foreground"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 ${step === 1 ? "bg-primary/30" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-foreground-muted">Step 1 of 4</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            어떤 느낌의 컷을 만들고 싶으세요?
          </h1>
          <p className="text-foreground-secondary text-lg">
            참고하고 싶은 쇼핑몰 이미지를 업로드해주세요
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Upload Zone or Preview */}
        {!previewUrl ? (
          <Card
            className={`p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/50 hover:bg-primary/3"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-6">
                <Upload className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-3">
                이런 분위기의 컷을 만들고 싶다면
                <br />
                여기에 올려주세요
              </h3>

              <p className="text-foreground-secondary mb-6">
                얼굴이 나오지 않는 의류 컷을 권장해요
              </p>

              <Button variant="outline" size="lg" className="mb-4" type="button">
                <ImageIcon className="w-5 h-5" />
                파일 선택
              </Button>

              <p className="text-sm text-foreground-muted">
                PNG, JPG • 최대 10MB
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-6 rounded-2xl bg-background border border-border relative">
            {/* 제거 버튼 */}
            {!isUploading && !isAnalyzing && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 p-2 rounded-full bg-background-secondary hover:bg-red-500/10 text-foreground-muted hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* 이미지 미리보기 */}
            <div className="relative">
              <img
                src={previewUrl}
                alt="레퍼런스 미리보기"
                className="w-full max-h-96 object-contain rounded-lg"
              />

              {/* 업로드 중 오버레이 */}
              {isUploading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-foreground font-medium">업로드 중...</p>
                  {uploadProgress > 0 && (
                    <div className="w-48 h-2 bg-border rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 분석 중 오버레이 */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <p className="text-foreground font-medium">스타일 분석 중...</p>
                  <p className="text-foreground-secondary text-sm mt-2">
                    약 2-3초 소요됩니다
                  </p>
                </div>
              )}
            </div>

            {/* 분석 완료 뱃지 */}
            {isComplete && (
              <div className="mt-6 flex flex-col items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">스타일 분석 완료</span>
                </div>

                {/* Display Tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {displayTags.map((tag) => (
                    <div
                      key={tag}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Guide Cards */}
        <div className="mt-12">
          <h4 className="text-center text-sm font-medium text-foreground-secondary mb-6">
            이런 이미지가 좋아요
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {["상체 컷", "전신 컷", "제품 컷"].map((type, i) => (
              <Card
                key={i}
                className="p-4 rounded-xl bg-background border border-border"
              >
                <div className="aspect-[3/4] rounded-lg bg-muted mb-3" />
                <p className="text-sm text-center text-foreground-secondary">
                  {type}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/">취소</Link>
          </Button>
          {isComplete ? (
            <Button size="lg" className="gap-2" asChild>
              <Link href="/create/step2">
                다음
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="gap-2" disabled>
              다음
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
