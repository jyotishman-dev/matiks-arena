"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Navbar } from "@/components/Navbar";
import { Lobby } from "@/components/Lobby";
import { GameArena } from "@/components/GameArena";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { token, isLoading, user } = useAuth();

  const {
    isConnected,
    onlineUsers,
    gameState,
    currentQuestion,
    score,
    streak,
    questionsAnswered,
    playGame,
    startPracticeMode,
    submitAnswer,
    finishGame,
    resetGame,
  } = useWebSocket(token);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14]">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
          <p className="text-sm font-semibold text-slate-400">Loading Matiks Arena...</p>
        </div>
      </div>
    );
  }

  if (!user && !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar isConnected={isConnected} />

      <main className="flex-1">
        {gameState === "PLAYING" || gameState === "FINISHED" ? (
          <GameArena
            question={currentQuestion}
            score={score}
            streak={streak}
            questionsAnswered={questionsAnswered}
            onSubmitAnswer={submitAnswer}
            onFinishGame={finishGame}
            onReturnLobby={resetGame}
          />
        ) : (
          <Lobby
            onlineUsers={onlineUsers}
            onPlayGame={playGame}
            onPracticeMode={startPracticeMode}
            isSearching={gameState === "SEARCHING"}
            isConnected={isConnected}
          />
        )}
      </main>
    </div>
  );
}
