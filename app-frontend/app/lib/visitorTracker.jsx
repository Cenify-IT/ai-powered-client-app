"use client";

import { useEffect } from "react";

export default function VisitorTracker({ domain }) {
  useEffect(() => {
    const initializeVisitor = async () => {
      try {
        const res = await fetch("/api/initialize-visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domain }),
        });

        if (!res.ok) {
          throw new Error("Failed to initialize visitor");
        }

        const data = await res.json();

        console.log("Visitor:", data);
      } catch (error) {
        console.error("Visitor tracking error:", error);
      }
    };

    initializeVisitor();
  }, [domain]);

  return null;
}
