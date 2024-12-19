import { useState, useEffect, ReactNode } from 'react';

export function FadeIn({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
