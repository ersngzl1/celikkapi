"use client";

import { useState, useEffect } from "react";

export function useContent(page: string) {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/content?page=${page}`)
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object" && !data.error) {
          setContent(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [page]);

  return { content, loaded };
}
