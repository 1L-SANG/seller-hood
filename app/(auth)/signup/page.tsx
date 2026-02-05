"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 폼 검증
    if (name.length < 2) {
      setError("이름은 2자 이상 입력해주세요.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Supabase Auth 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // user_metadata에 이름 저장
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("사용자 생성에 실패했습니다.");
      }

      // users 테이블에 INSERT
      const { error: insertError } = await supabase.from("users").insert({
        id: authData.user.id,
        name,
        email,
        plan: "starter" as const,
        credits_limit: 10,
        credits_used: 0,
        credits_reset_at: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1
        ).toISOString(),
      } as any); // 타입 캐스팅 (임시 해결책)

      if (insertError) {
        console.error("users 테이블 INSERT 실패:", insertError);
        // Auth는 성공했으므로 계속 진행
      }

      // 성공: Step 1로 리다이렉트
      router.push("/create/step1");
    } catch (err: any) {
      console.error("회원가입 에러:", err);
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background px-6 py-12">
      <Card className="w-full max-w-md p-8 md:p-10 rounded-2xl border border-border shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <span className="text-primary-foreground font-bold">각</span>
            </div>
            <span className="text-2xl font-semibold text-foreground">
              각<span className="text-primary">자</span>
            </span>
          </Link>
        </div>

        {/* Tagline */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            무료로 시작하기
          </h1>
          <p className="text-foreground-secondary text-sm">
            지금 가입하고 10장의 의류컷을 무료로 만들어보세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground-secondary">
              이름
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11"
                required
                minLength={2}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground-secondary">
              이메일
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground-secondary">
              비밀번호
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-foreground-muted">
              최소 8자 이상 입력해주세요
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-250"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                회원가입 중...
              </>
            ) : (
              "회원가입"
            )}
          </Button>
        </form>

        {/* Terms */}
        <p className="mt-6 text-center text-xs text-foreground-muted">
          가입하시면{" "}
          <Link href="/#" className="text-primary hover:underline">
            이용약관
          </Link>
          과{" "}
          <Link href="/#" className="text-primary hover:underline">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-foreground-muted">
              또는
            </span>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-foreground-secondary">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            로그인
          </Link>
        </p>

        {/* Trust Badge */}
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-foreground-muted text-xs">
          <Lock className="w-4 h-4" />
          <span>256-bit 암호화</span>
        </div>
      </Card>
    </div>
  );
}
