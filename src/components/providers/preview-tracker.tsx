"use client";

import { useEffect } from "react";
import { incrementPreviewCount } from "@/lib/actions/preview";

export function PreviewTracker() {
  useEffect(() => {
    const track = async () => {
      try {
        await incrementPreviewCount();
      } catch (error) {
        console.error("Failed to increment preview count:", error);
      }
    };
    track();
  }, []);

  return null;
}
