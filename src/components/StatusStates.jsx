import React from "react";
import { theme } from "../theme";

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ background: "#E9E7F0" }}
    />
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
        style={{ background: "#FDEDED" }}
      >
        ⚠️
      </div>
      <p className="font-semibold" style={{ color: theme.text }}>
        Something didn't load
      </p>
      <p className="text-sm mt-1 mb-4" style={{ color: theme.textMuted }}>
        {message || "Please check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-full font-semibold text-sm text-white"
        style={{ background: theme.purpleBrand }}
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div className="text-3xl mb-2">🔍</div>
      <p className="text-sm" style={{ color: theme.textMuted }}>
        {text}
      </p>
    </div>
  );
}
