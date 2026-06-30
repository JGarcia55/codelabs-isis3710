"use client";

import { useState, useEffect } from "react";
import {
  onOperationStatusChange,
  isOperationInProgress,
} from "@/lib/github";

export function useOperationStatus(): boolean {
  const [busy, setBusy] = useState(isOperationInProgress());
  useEffect(() => onOperationStatusChange(setBusy), []);
  return busy;
}
