"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Question } from "@/hooks/useWebSocket";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, Flame, Check, X, RotateCcw, Home, Trophy, Delete, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";

interface GameArenaProps {
  question: Question | null;
  score: number;
  streak: number;
  questionsAnswered: number;
  onSubmitAnswer: (answer: number) => boolean;
  onFinishGame: () => void;
  onReturnLobby: () => void;
}

export function GameArena({
  question,
  score,
  streak,
  questionsAnswered,
  onSubmitAnswer,
  onFinishGame,
  onReturnLobby,
}: GameArenaProps) {
  const [userInputValue, setUserInputValue] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [feedback, setFeedback] = useState<"CORRECT" | "WRONG" | null>(null);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on question change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  // Game countdown timer (60 seconds)
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameEnded(true);
      onFinishGame();
      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onFinishGame]);

  const handleSendAnswer = useCallback(
    (customInput?: string) => {
      const valToSubmit = customInput !== undefined ? customInput : userInputValue;
      if (!valToSubmit || isNaN(Number(valToSubmit))) return;

      const numVal = parseFloat(valToSubmit);
      const isCorrect = onSubmitAnswer(numVal);

      if (isCorrect) {
        setFeedback("CORRECT");
        setUserInputValue("");
        setTimeout(() => setFeedback(null), 300);
      } else {
        setFeedback("WRONG");
        setTimeout(() => setFeedback(null), 400);
      }
    },
    [userInputValue, onSubmitAnswer]
  );

  // Handle physical keyboard input (Digits, Backspace, Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  // Touch keypad actions
  const handleKeypadPress = (val: string) => {
    if (val === "BACKSPACE") {
      setUserInputValue((prev) => prev.slice(0, -1));
    } else if (val === "CLEAR") {
      setUserInputValue("");
    } else if (val === "ENTER") {
      handleSendAnswer();
    } else {
      setUserInputValue((prev) => prev + val);
    }
  };

  const getSignSymbol = (sign: string) => {
    switch (sign) {
      case "PLUS":
        return "+";
      case "MINUS":
        return "-";
      case "MULTIPLICATION":
        return "×";
      case "DIVIDE":
        return "÷";
      default:
        return "+";
    }
  };

  if (isGameEnded || !question) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl text-center p-8 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-xl shadow-amber-500/20">
            <Trophy className="h-10 w-10 text-slate-950 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Battle Finished!</h2>
            <p className="text-slate-400 text-sm">Great effort! Here is your match summary:</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs uppercase font-bold text-slate-400">Final Score</span>
              <p className="text-4xl font-black text-emerald-400 mt-1">{score}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <span className="text-xs uppercase font-bold text-slate-400">Questions Solved</span>
              <p className="text-4xl font-black text-cyan-400 mt-1">{questionsAnswered}</p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Button size="lg" onClick={onReturnLobby} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Lobby
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-xl">
        <Button variant="ghost" size="sm" onClick={onReturnLobby} className="text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Exit
        </Button>

        {/* Clock Timer */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-1.5 text-lg font-black text-emerald-400">
          <Clock className="h-5 w-5 text-emerald-400 animate-pulse" />
          <span>{timeLeft}s</span>
        </div>

        {/* Streak & Score */}
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <Badge variant="amber" className="flex items-center gap-1 font-bold text-xs py-1">
              <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              {streak}x Streak
            </Badge>
          )}

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
            <p className="text-xl font-black text-white">{score}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold text-slate-400">
          <span>Match Progress</span>
          <span>{questionsAnswered} Solved</span>
        </div>
        <Progress value={(60 - timeLeft) * (100 / 60)} className="h-2.5" />
      </div>

      {/* Main Speed Math Question Display Card */}
      <Card
        className={`border-2 transition-all duration-200 bg-slate-900/95 shadow-2xl backdrop-blur-xl ${
          feedback === "CORRECT"
            ? "border-emerald-500 shadow-emerald-500/30 scale-[1.02]"
            : feedback === "WRONG"
            ? "border-rose-500 shadow-rose-500/30 animate-shake"
            : "border-slate-800"
        }`}
      >
        <CardContent className="p-8 text-center space-y-6">
          {/* Operation Badge */}
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 text-2xl font-black border border-emerald-500/30 shadow-md">
            {getSignSymbol(question.sign)}
          </div>

          {/* Math Problem Equation */}
          <div className="flex items-center justify-center gap-4 text-5xl sm:text-6xl font-black text-white tracking-tight">
            <span>{question.operation1}</span>
            <span className="text-emerald-400">{getSignSymbol(question.sign)}</span>
            <span>{question.operation2}</span>
            <span className="text-slate-500 font-normal">=</span>
          </div>

          {/* Input Box */}
          <div className="mx-auto max-w-xs">
            <input
              ref={inputRef}
              type="number"
              placeholder="Your answer..."
              value={userInputValue}
              onChange={(e) => setUserInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full rounded-2xl border-2 border-slate-700 bg-slate-950 text-center text-4xl font-black text-white py-3 px-4 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner"
            />
          </div>
        </CardContent>
      </Card>

      {/* Touch Keypad for Mobile / Tablet / On-Screen Play */}
      <div className="mx-auto max-w-sm grid grid-cols-3 gap-2.5 pt-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
          <button
            key={num}
            onClick={() => handleKeypadPress(num)}
            className="flex h-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-2xl font-black text-slate-100 hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => handleKeypadPress("BACKSPACE")}
          className="flex h-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
          title="Backspace"
        >
          <Delete className="h-6 w-6" />
        </button>

        <button
          onClick={() => handleSendAnswer()}
          className="col-span-2 flex h-14 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 text-lg font-black hover:bg-emerald-400 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          Submit <Check className="ml-2 h-5 w-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
