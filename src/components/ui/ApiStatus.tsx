"use client";

import { useState, useEffect } from "react";
import { healthCheck } from "@/lib/api";

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">(
    "checking"
  );
  const [apiUrl, setApiUrl] = useState<string>("");

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");
        await healthCheck();
        setStatus("connected");
      } catch (error) {
        console.error("API Health Check Failed:", error);
        setStatus("error");
      }
    };

    checkApiHealth();
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`
        px-3 py-2 rounded-lg text-xs font-medium backdrop-blur-sm border
        ${
          status === "connected"
            ? "bg-green-500/20 border-green-400/50 text-green-400"
            : status === "error"
            ? "bg-red-500/20 border-red-400/50 text-red-400"
            : "bg-yellow-500/20 border-yellow-400/50 text-yellow-400"
        }
      `}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status === "connected"
                ? "bg-green-400"
                : status === "error"
                ? "bg-red-400"
                : "bg-yellow-400 animate-pulse"
            }`}
          />
          <span>
            API:{" "}
            {status === "checking"
              ? "Checking..."
              : status === "connected"
              ? "Connected"
              : "Disconnected"}
          </span>
        </div>
        <div className="text-xs opacity-75 mt-1">{apiUrl}</div>
      </div>
    </div>
  );
}
