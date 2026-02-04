"use client";

import { useState, useCallback } from "react";
import { AppHeader } from "@/components/sellerhood/app/app-header";
import { ProgressIndicator } from "@/components/sellerhood/app/progress-indicator";
import { ReferenceUpload } from "@/components/sellerhood/app/reference-upload";
import { StyleConfirmation } from "@/components/sellerhood/app/style-confirmation";
import { ProductUpload } from "@/components/sellerhood/app/product-upload";
import { GenerateStep } from "@/components/sellerhood/app/generate-step";
import { GeneratingState } from "@/components/sellerhood/app/generating-state";
import { ResultScreen } from "@/components/sellerhood/app/result-screen";

export type AppStep =
  | "reference"
  | "confirm"
  | "product"
  | "generate"
  | "generating"
  | "result";

export interface ImageData {
  file: File | null;
  preview: string;
}

export default function AppPage() {
  const [currentStep, setCurrentStep] = useState<AppStep>("reference");
  const [referenceImage, setReferenceImage] = useState<ImageData>({
    file: null,
    preview: "",
  });
  const [productImage, setProductImage] = useState<ImageData>({
    file: null,
    preview: "",
  });
  const [resultImage, setResultImage] = useState<string>("");

  const handleReferenceUpload = useCallback((file: File, preview: string) => {
    setReferenceImage({ file, preview });
  }, []);

  const handleProductUpload = useCallback((file: File, preview: string) => {
    setProductImage({ file, preview });
  }, []);

  const handleGenerate = useCallback(() => {
    setCurrentStep("generating");
    // Simulate generation process
    setTimeout(() => {
      // Use a placeholder result (in real app, this would come from API)
      setResultImage(productImage.preview);
      setCurrentStep("result");
    }, 4000);
  }, [productImage.preview]);

  const handleReset = useCallback(() => {
    setCurrentStep("reference");
    setReferenceImage({ file: null, preview: "" });
    setProductImage({ file: null, preview: "" });
    setResultImage("");
  }, []);

  const handleRegenerate = useCallback(() => {
    setCurrentStep("generating");
    setTimeout(() => {
      setResultImage(productImage.preview);
      setCurrentStep("result");
    }, 4000);
  }, [productImage.preview]);

  const renderStep = () => {
    switch (currentStep) {
      case "reference":
        return (
          <ReferenceUpload
            imageData={referenceImage}
            onUpload={handleReferenceUpload}
            onNext={() => setCurrentStep("confirm")}
          />
        );
      case "confirm":
        return (
          <StyleConfirmation
            referenceImage={referenceImage}
            onConfirm={() => setCurrentStep("product")}
            onBack={() => setCurrentStep("reference")}
          />
        );
      case "product":
        return (
          <ProductUpload
            referenceImage={referenceImage}
            productImage={productImage}
            onUpload={handleProductUpload}
            onNext={() => setCurrentStep("generate")}
            onBack={() => setCurrentStep("confirm")}
          />
        );
      case "generate":
        return (
          <GenerateStep
            referenceImage={referenceImage}
            productImage={productImage}
            onGenerate={handleGenerate}
            onBack={() => setCurrentStep("product")}
          />
        );
      case "generating":
        return (
          <GeneratingState
            onCancel={() => setCurrentStep("generate")}
          />
        );
      case "result":
        return (
          <ResultScreen
            resultImage={resultImage}
            referenceImage={referenceImage}
            onRegenerate={handleRegenerate}
            onNewProject={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pt-[72px]">
        {currentStep !== "generating" && currentStep !== "result" && (
          <ProgressIndicator currentStep={currentStep} />
        )}
        <div className="max-w-[800px] mx-auto px-6 py-12">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
