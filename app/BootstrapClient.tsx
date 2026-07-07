"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // 🚨 TypeScript ka error bypass karne ke liye ignore tag lagaya hai
    // @ts-ignore
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}