"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Trophy, LogOut, User, Wifi, WifiOff } from "lucide-react";

interface NavbarProps {
  isConnected?: boolean;
}

export function Navbar({ isConnected = false }: NavbarProps) {
  const { user, logout } = useAuth();

  const userRating = user?.rating?.[0]?.rating ?? 1200;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Zap className="h-6 w-6 text-slate-950 fill-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              MATIKS<span className="text-emerald-400">.</span>
            </span>
            <span className="hidden text-[10px] uppercase font-bold tracking-widest text-slate-400 sm:block">
              Speed Math Arena
            </span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3">
          {/* WS Status Badge */}
          <Badge
            variant={isConnected ? "emerald" : "outline"}
            className="hidden items-center gap-1.5 px-3 py-1 text-xs font-semibold sm:flex"
          >
            {isConnected ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                Live Arena
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-slate-400" />
                Solo Practice
              </>
            )}
          </Badge>

          {user && (
            <>
              {/* ELO Rating Badge */}
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-sm font-bold text-amber-400">
                <Trophy className="h-4 w-4 text-amber-400 fill-amber-400/20" />
                <span>{userRating}</span>
                <span className="text-[10px] uppercase text-slate-400">Rating</span>
              </div>

              {/* User Dropdown / Name & Logout */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-200">
                  <User className="h-4 w-4" />
                </div>
                <span className="hidden text-sm font-semibold text-slate-200 md:inline">
                  {user.username}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
