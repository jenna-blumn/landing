"use client";

import { useEffect, useRef, useState } from "react";

interface UseViewObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  once?: boolean;
  initialInView?: boolean;
  debounce?: number;
}

interface UseViewObserverReturn<T extends Element> {
  ref: React.RefObject<T>;
  isInView: boolean;
  entry: IntersectionObserverEntry | null;
}

function useViewObserver<T extends Element = HTMLDivElement>(
  options: UseViewObserverOptions = {}
): UseViewObserverReturn<T> {
  const {
    threshold = 0,
    rootMargin = "0px",
    root = null,
    once = false,
    initialInView = false,
  } = options;

  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(initialInView);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setIsInView(entry.isIntersecting);

        if (once && entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, root, once]);

  return { ref: ref as React.RefObject<T>, isInView, entry };
}

export default useViewObserver;
