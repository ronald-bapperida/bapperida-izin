import type { ReactNode } from 'react';

interface CardSectionProps {
  title: string;
  children: ReactNode;
  stepLabel?: string;
}

export function CardSection({ title, children, stepLabel }: CardSectionProps) {
  return (
    <section className="bg-card rounded-lg border shadow-sm animate-slide-up">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        {stepLabel && (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
            {stepLabel}
          </span>
        )}
        <h2 className="font-semibold text-foreground text-sm">{title}</h2>
      </div>
      <div className="px-4 py-4 space-y-4">{children}</div>
    </section>
  );
}
