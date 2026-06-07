"use client";

import { useEffect } from "react";
import { incrementPreviewCount } from "@/lib/actions/preview";

interface PreviewTrackerProps {
  paperId?: string;
}

export function PreviewTracker({ paperId }: PreviewTrackerProps) {
  useEffect(() => {
    const track = async () => {
      try {
        await incrementPreviewCount(paperId);
      } catch (error) {
        console.error("Failed to increment preview count:", error);
      }
    };
    track();
  }, [paperId]);

  return null;
}
