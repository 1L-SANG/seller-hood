"use client";

import React from "react"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const passwordRequirements = [
    { text: "8자 이상", met: formData.password.length >= 8 },
    { text: "영문 포함", met: /[a-zA-Z]/.test(formData.password) },
    { text: "숫자 포함", met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    
    setIsLoading(true);
    
    // 시뮬레이션 회원가입 (실제 구현 시 API 호출)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary-light/5 to-background items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="w-64 h-64 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="text-6xl font-bold text-primary-foreground">S</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            무료로 시작하세요
          </h2>
          <p className="text-foreground-secondary text-center mb-8">
            회원가입 후 무료 크레딧으로 AI 의류컷 생성을 체험해보세요.
          </p>
          
          <div className="space-y-4">
            {[
              "무료 크레딧 5회 제공",
              "모든 스타일 템플릿 이용 가능",
              "고해상도 이미지 다운로드",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check size={14} className="text-primary" />
                </div>
                <span className="text-foreground-secondary">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>홈으로 돌아가기</span>
          </Link>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-semibold text-foreground">
              Seller<span className="text-primary">hood</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            계정 만들기
          </h1>
          <p className="text-foreground-secondary mb-8">
            지금 가입하고 AI 의류컷 생성을 시작하세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                이름
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-12 bg-background-secondary border-border focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="h-12 bg-background-secondary border-border focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="h-12 bg-background-secondary border-border focus:border-primary focus:ring-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Requirements */}
              <div className="flex gap-4 mt-2">
                {passwordRequirements.map((req) => (
                  <div
                    key={req.text}
                    className={`flex items-center gap-1.5 text-sm ${
                      req.met ? "text-success" : "text-foreground-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? "bg-success" : "bg-border"
                      }`}
                    >
                      {req.met && <Check size={10} className="text-success-foreground" />}
                    </div>
                    {req.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm text-foreground-secondary leading-relaxed">
                <Link href="#" className="text-primary hover:text-primary-light">
                  이용약관
                </Link>
                {" "}및{" "}
                <Link href="#" className="text-primary hover:text-primary-light">
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "계정 생성 중..." : "계정 만들기"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-foreground-muted">
                  또는
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 border-border hover:bg-background-secondary bg-transparent"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 border-border hover:bg-background-secondary bg-transparent"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-foreground-secondary">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-light font-medium transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
