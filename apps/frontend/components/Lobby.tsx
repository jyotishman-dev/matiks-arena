"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { OnlineUser } from "@/hooks/useWebSocket";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Play, Trophy, Users, Swords, Flame, Sparkles, Loader2 } from "lucide-react";

interface LobbyProps {
  onlineUsers: OnlineUser[];
  onPlayGame: () => void;
  onPracticeMode: () => void;
  isSearching: boolean;
  isConnected: boolean;
}

export function Lobby({
  onlineUsers,
  onPlayGame,
  onPracticeMode,
  isSearching,
  isConnected,
}: LobbyProps) {
  const { user } = useAuth();
  const userRating = user?.rating?.[0]?.rating ?? 1200;
  const gamesPlayed = user?.gameMember?.length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Season 1 Active
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Prove Your Speed in <span className="text-emerald-400">Real-Time</span> Math
          </h1>
          <p className="text-base text-slate-300">
            Out-calculate opponents in lightning-fast 1v1 mental math battles. Earn ELO rating points and climb the global leaderboard.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              size="xl"
              onClick={onPlayGame}
              disabled={isSearching}
              className="glow-emerald group"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Finding Opponent...
                </>
              ) : (
                <>
                  <Swords className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Find Match (1v1 Live)
                </>
              )}
            </Button>

            <Button
              size="xl"
              variant="outline"
              onClick={onPracticeMode}
              disabled={isSearching}
              className="border-slate-700 bg-slate-900/50 hover:bg-slate-800"
            >
              <Play className="mr-2 h-5 w-5 text-emerald-400" />
              Solo Practice
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Matchmaking Modes & Live Players */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* User Stats Card */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              Your Career Stats
            </CardTitle>
            <CardDescription>Performance breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                <span className="text-xs uppercase font-bold text-slate-400">ELO Rating</span>
                <p className="text-3xl font-black text-amber-400 mt-1">{userRating}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
                <span className="text-xs uppercase font-bold text-slate-400">Total Battles</span>
                <p className="text-3xl font-black text-emerald-400 mt-1">{gamesPlayed}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Calculation Speed</span>
                <span className="text-emerald-400">Fast (Master)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-4/5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Arena Status Card */}
        <Card className="border-slate-800 bg-slate-900/80 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-400" />
                Live Arena Lobby
              </CardTitle>
              <CardDescription>Active online competitors</CardDescription>
            </div>
            <Badge variant={isConnected ? "emerald" : "outline"}>
              {isConnected ? "Connected to Server" : "Practice Server"}
            </Badge>
          </CardHeader>
          <CardContent>
            {onlineUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
                <Users className="h-10 w-10 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-400">
                  You are in the arena! Waiting for other online competitors.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Find Match" to start searching or "Solo Practice" to warm up.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {onlineUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.name}</p>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ready for Battle
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
