"use client";

import * as React from "react";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";

export function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = React.useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);
    if (entries.length === 0) {
      return null;
    }
    const names = entries
      .filter(([, serialized]) => typeof serialized === "string")
      .map(([name]) => name)
      .join(" ");
    const styles = entries
      .filter(([, serialized]) => typeof serialized === "string")
      .map(([, serialized]) => serialized)
      .join("");

    return (
      <style
        key="emotion"
        data-emotion={`css ${names}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
