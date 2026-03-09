import { Info } from 'lucide-react';
import type { ReactNode } from 'react';

interface InfoAlertProps {
  children: ReactNode;
  variant?: 'info' | 'warning';
}

export function InfoAlert({ children, variant = 'info' }: InfoAlertProps) {
  const bg = variant === 'warning' ? 'bg-warning/10 border-warning/30' : 'bg-primary/5 border-primary/20';
  const iconColor = variant === 'warning' ? 'text-warning' : 'text-primary';

  return (
    <div className={`rounded-lg border p-4 ${bg}`}>
      <div className="flex gap-3">
        <Info className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
        <div className="text-sm text-foreground space-y-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-0.5 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
  );
}
