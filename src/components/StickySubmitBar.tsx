import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface StickySubmitBarProps {
  status: Status;
  onSubmit: () => void;
  errorMessage?: string;
}

export function StickySubmitBar({ status, onSubmit, errorMessage }: StickySubmitBarProps) {
  const { t } = useI18n();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t safe-bottom">
      <div className="mx-auto max-w-lg px-4 py-3 space-y-1">
        {status === 'error' && errorMessage && (
          <div className="flex items-center gap-2 text-destructive text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{errorMessage}</span>
          </div>
        )}
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={status === 'loading' || status === 'success'}
          className="w-full tap-target font-semibold text-base gap-2"
          size="lg"
        >
          {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-5 h-5" />}
          {status === 'idle' && <Send className="w-5 h-5" />}
          {status === 'error' && <AlertCircle className="w-5 h-5" />}
          {status === 'loading' ? t('common.submitting') : status === 'success' ? t('common.submitted') : t('common.submit')}
        </Button>
      </div>
    </div>
  );
}
