"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type QuestionSign = "PLUS" | "MINUS" | "DIVIDE" | "MULTIPLICATION";

export type Question = {
  id: string;
  operation1: number;
  operation2: number;
  sign: QuestionSign;
  answer: number;
};

export type OnlineUser = {
  id: string;
  name: string;
};

export type GameState = "IDLE" | "SEARCHING" | "PLAYING" | "FINISHED";

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export function useWebSocket(token: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);

  // Connect to WebSocket
  useEffect(() => {
    if (!token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    const wsUrl = `${WS_BASE_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS message received:", data.type, data.payload);

        if (data.type === "ONLINE_USERS") {
          // payload.user is an array of [id, userObj]
          const usersList: OnlineUser[] = [];
          if (Array.isArray(data.payload?.user)) {
            data.payload.user.forEach((item: any) => {
              if (Array.isArray(item) && item[1]) {
                usersList.push({ id: item[1].id, name: item[1].name });
              } else if (item && item.id && item.name) {
                usersList.push({ id: item.id, name: item.name });
              }
            });
          }
          setOnlineUsers(usersList);
        }

        if (data.type === "GAME_REQUEST") {
          // Another player started searching
          console.log("Game request broadcast received for game", data.payload?.gameId);
        }

        if (data.type === "QUESTION") {
          const { gameId: gId, question } = data.payload || {};
          if (gId) setGameId(gId);
          if (question) {
            setCurrentQuestion(question);
            setGameState("PLAYING");
          }
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, [token]);

  // Request to play game
  const playGame = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setGameState("SEARCHING");
      setScore(0);
      setStreak(0);
      setQuestionsAnswered(0);
      wsRef.current.send(
        JSON.stringify({
          type: "PLAY_GAME",
          payload: {},
        })
      );
    } else {
      // Fallback for offline / demo practice mode
      startPracticeMode();
    }
  }, []);

  // Practice Mode (Fallback when WS backend is unavailable or offline)
  const startPracticeMode = useCallback(() => {
    setGameState("SEARCHING");
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
    const mockGameId = "practice-" + Math.random().toString(36).substring(2, 9);
    setGameId(mockGameId);

    setTimeout(() => {
      setCurrentQuestion(generateMockQuestion());
      setGameState("PLAYING");
    }, 1200);
  }, []);

  // Submit Answer
  const submitAnswer = useCallback(
    (answerValue: number) => {
      if (!currentQuestion) return false;

      const isCorrect = Math.abs(answerValue - currentQuestion.answer) < 0.001;

      if (isCorrect) {
        setScore((prev) => prev + 10 + streak * 2);
        setStreak((prev) => prev + 1);
        setQuestionsAnswered((prev) => prev + 1);
      } else {
        setStreak(0);
      }

      // Send to server if WS connected
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && gameId) {
        wsRef.current.send(
          JSON.stringify({
            type: "SUBMIT_ANSWER",
            payload: {
              gameId,
              questionId: currentQuestion.id,
              answer: answerValue,
            },
          })
        );
      } else if (isCorrect) {
        // Practice mode auto advance
        setTimeout(() => {
          setCurrentQuestion(generateMockQuestion());
        }, 150);
      }

      return isCorrect;
    },
    [currentQuestion, gameId, streak]
  );

  const finishGame = useCallback(() => {
    setGameState("FINISHED");
  }, []);

  const resetGame = useCallback(() => {
    setGameState("IDLE");
    setGameId(null);
    setCurrentQuestion(null);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered(0);
  }, []);

  return {
    isConnected,
    onlineUsers,
    gameState,
    gameId,
    currentQuestion,
    score,
    streak,
    questionsAnswered,
    playGame,
    startPracticeMode,
    submitAnswer,
    finishGame,
    resetGame,
  };
}

// Helper for offline practice question generation
function generateMockQuestion(): Question {
  const signs: QuestionSign[] = ["PLUS", "MINUS", "MULTIPLICATION", "DIVIDE"];
  const sign = signs[Math.floor(Math.random() * signs.length)]!;
  let op1 = Math.floor(Math.random() * 12) + 1;
  let op2 = Math.floor(Math.random() * 12) + 1;
  let answer: number;

  switch (sign) {
    case "PLUS":
      answer = op1 + op2;
      break;
    case "MINUS":
      if (op1 < op2) [op1, op2] = [op2, op1];
      answer = op1 - op2;
      break;
    case "MULTIPLICATION":
      answer = op1 * op2;
      break;
    case "DIVIDE":
      answer = op1;
      op1 = op1 * op2;
      break;
  }

  return {
    id: "q-" + Math.random().toString(36).substring(2, 9),
    operation1: op1,
    operation2: op2,
    sign,
    answer,
  };
}
