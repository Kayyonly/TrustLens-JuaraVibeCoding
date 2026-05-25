/* eslint-disable */
// @ts-nocheck
import { useState, useEffect } from "react";

export type HistoryItem = {
  id: string;
  timestamp: number;
  title: string;
  threatScore: number;
  threatLevel: string;
  category: string;
  summary: string;
  thumbnail: string | null;
  result: any;
  mode?: "screenshot" | "text";
  textPreview?: string;
};

export function useScanHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("trustlens-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
      } catch {
        console.error("Failed to parse history");
      }
    }
    setIsLoaded(true);
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("trustlens-history", JSON.stringify(newHistory));
  };

  const addScan = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 50);
    saveHistory(updated);
  };

  const deleteScan = (id: string) => {
    saveHistory(history.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return { history, isLoaded, addScan, deleteScan, clearHistory };
}

export const generateMiniThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scale = 100 / img.width;
        canvas.width = 100;
        canvas.height = img.height * scale;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.3));
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  });
};