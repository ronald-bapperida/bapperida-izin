import { Check } from 'lucide-react';

interface FormStepperProps {
  steps: string[];
  currentStep: number;
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2 px-1 no-scrollbar" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={steps.length}>
      {steps.map((title, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center gap-1 shrink-0">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
              done ? 'bg-success text-success-foreground' : active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium max-w-[5rem] truncate ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
              {title}
            </span>
            {i < steps.length - 1 && <div className="w-4 h-px bg-border shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}
