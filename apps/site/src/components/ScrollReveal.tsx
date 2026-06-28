import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function ScrollReveal({
  children,
  className = '',
  threshold = 0.15,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const getTransform = useCallback(() => {
    const d = 40;
    switch (direction) {
      case 'up': return `translateY(${d}px)`;
      case 'down': return `translateY(${-d}px)`;
      case 'left': return `translateX(${d}px)`;
      case 'right': return `translateX(${-d}px)`;
    }
  }, [direction]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0, 0)' : getTransform(),
        transition: `opacity 0.7s ease, transform 0.7s ease`,
      }}
    >
      {children}
    </div>
  );
}
