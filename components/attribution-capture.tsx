"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Runs once on first paint, where the landing URL's parameters still exist. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
