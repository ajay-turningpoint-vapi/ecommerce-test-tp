import { useState, useEffect } from 'react';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 800);
    const remove = setTimeout(onComplete, 1100);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <h1
          className="text-4xl md:text-5xl font-extrabold italic tracking-tight"
          style={{ fontFamily: 'Poppins, sans-serif', color: 'hsl(var(--primary))' }}
        >
          Super Beauty
        </h1>
        <div className="flex gap-1.5 mt-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
