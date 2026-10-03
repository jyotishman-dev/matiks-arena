"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, token } = useAuth();

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg("Welcome back! Redirecting to arena...");
        setTimeout(() => router.push("/"), 800);
      } else {
        setErrorMsg(res.message || "Failed to login.");
      }
    } else {
      const res = await register(email, password);
      if (res.success) {
        setSuccessMsg(res.message || "Account created! You can now log in.");
        setIsLogin(true);
        setPassword("");
      } else {
        setErrorMsg(res.message || "Registration failed.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080c14] px-4 py-12 relative overflow-hidden">
      {/* Glow background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/20">
            <Zap className="h-8 w-8 text-slate-950 fill-slate-950 stroke-[2.5]" />
          </div>
          <CardTitle className="text-3xl font-black text-white tracking-tight">
            MATIKS<span className="text-emerald-400">.</span>
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            {isLogin ? "Sign in to enter the speed math arena" : "Create an account to challenge competitors"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Tab Selector */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`rounded-lg py-2 text-sm font-bold transition-all ${
                isLogin
                  ? "bg-slate-800 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`rounded-lg py-2 text-sm font-bold transition-all ${
                !isLogin
                  ? "bg-slate-800 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Enter Arena" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-800/60 pt-4 text-xs text-slate-500">
          Matiks Real-time Speed Math Competition System
        </CardFooter>
      </Card>
    </div>
  );
}
